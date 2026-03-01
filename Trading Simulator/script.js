/**
 * Trading Simulator - Core Logic + Local Indicator Engine
 * - Master Candle breakout
 * - EMA 12/26/200
 * - Buy/Sell markers + Stop labels
 * - Alert conditions panel
 */

// --- State Management ---
const STATE = {
  // Set so seeded +15.38 result reflects your current 115.00 balance
  balance: 99.62,
  startingBalance: 99.62,
  livePrice: 0.0,
  leverage: 25,

  // Active Position
  position: null, // { type: 'LONG'|'SHORT', entryPrice, sizeUsd, openTime }

  // Statistics
  trades: [],
  wins: 0,
  losses: 0,
  bestTrade: 0,
  worstTrade: 0,
  maxDrawdown: 0,
  peakBalance: 99.62,

  // Latest indicator signal for display
  latestSignal: null, // { time, type, stopLoss, trendChanged }

  // Market / Indicator
  candles: [], // {time(sec), open, high, low, close}
  signals: [], // {type:'BUY'|'SELL', time, price, stopLoss}
  alerts: [], // latest alert strings
  lastForwardedAlert: null,
  bridgeUrl: 'http://127.0.0.1:8787/indicator-alert',
  simulationUrl: 'http://127.0.0.1:5500/Trading%20Simulator/index.html',
  indicator: {
    masterCandlePeriod: 4,
    stopLossTicks: 4,
    xprd1: 12,
    xprd2: 26,
    xprd200: 200,
    xsmooth: 1,
  },

  // Auto trade-position overlay from latest indicator signal
  referencePlan: {
    enabled: true,
    rr: 2.5,
    currentPrice: 0,
  }
};

// --- DOM Elements ---
const DOM = {
  // Portfolio
  balance: document.getElementById('account-balance'),
  winRate: document.getElementById('win-rate'),
  maxDrawdown: document.getElementById('max-drawdown'),
  bestTrade: document.getElementById('best-trade'),
  worstTrade: document.getElementById('worst-trade'),

  // Trading Controls
  livePrice: document.getElementById('live-price'),
  tradeAmountInput: document.getElementById('trade-amount'),
  btnBuy: document.getElementById('btn-buy'),
  btnSell: document.getElementById('btn-sell'),

  // Open Position Panel
  positionPanel: document.getElementById('open-position-panel'),
  typeBadge: document.getElementById('open-type-badge'),
  openTime: document.getElementById('open-time'),
  entryPrice: document.getElementById('open-entry-price'),
  positionSize: document.getElementById('open-size'),
  openPnl: document.getElementById('open-pnl'),
  btnClose: document.getElementById('btn-close-position'),

  // Logger
  totalTrades: document.getElementById('total-trades'),
  historyList: document.getElementById('trade-history-list'),
  btnReset: document.getElementById('btn-reset'),

  // Sidebar Tabs
  sidebarTabTrade: document.getElementById('sidebar-tab-trade'),
  sidebarTabLogger: document.getElementById('sidebar-tab-logger'),
  sidebarPanelTrade: document.getElementById('sidebar-panel-trade'),
  sidebarPanelLogger: document.getElementById('sidebar-panel-logger'),

  // Chart + Alerts
  chartHost: document.getElementById('custom-chart'),
  indicatorStatus: document.getElementById('indicator-status'),
  alertList: document.getElementById('indicator-alert-list'),

  // Screenshot
  btnScreenshot: document.getElementById('btn-screenshot'),
};

let chartApi;
let candleSeries;
let ema12Series;
let ema26Series;
let ema200Series;
let referencePlanLines = [];

// --- Initialization ---
async function init() {
  attachEventListeners();
  setSidebarTab('trade');
  setupChart();
  await bootstrapMarketData();
  setupLivePriceSocket();
  
  // Try to load from storage first, otherwise seed initial data
  const loaded = loadFromStorage();
  if (!loaded) {
    seedInitialTradeData();
  } else {
    renderTradeList();
  }
  
  updateUI();
}

function attachEventListeners() {
  DOM.btnBuy.addEventListener('click', () => openPosition('LONG'));
  DOM.btnSell.addEventListener('click', () => openPosition('SHORT'));
  DOM.btnClose.addEventListener('click', closePosition);
  DOM.btnReset.addEventListener('click', resetSimulator);

  DOM.sidebarTabTrade?.addEventListener('click', () => setSidebarTab('trade'));
  DOM.sidebarTabLogger?.addEventListener('click', () => setSidebarTab('logger'));

  DOM.btnScreenshot?.addEventListener('click', captureAndSendChart);
}

function setSidebarTab(tab) {
  const isTrade = tab === 'trade';
  DOM.sidebarTabTrade?.classList.toggle('active', isTrade);
  DOM.sidebarTabLogger?.classList.toggle('active', !isTrade);
  DOM.sidebarPanelTrade?.classList.toggle('active', isTrade);
  DOM.sidebarPanelLogger?.classList.toggle('active', !isTrade);
}

// --- Chart + Data ---
function setupChart() {
  chartApi = LightweightCharts.createChart(DOM.chartHost, {
    layout: { background: { color: '#ffffff' }, textColor: '#334155' },
    grid: {
      vertLines: { color: 'rgba(15, 23, 42, 0.05)' },
      horzLines: { color: 'rgba(15, 23, 42, 0.05)' },
    },
    rightPriceScale: { borderColor: '#e2e8f0' },
    timeScale: {
      borderColor: '#e2e8f0',
      timeVisible: true,
      secondsVisible: false,
      barSpacing: 10,
      rightOffset: 8,
    },
    crosshair: { mode: 1 },
  });

  const candleOpts = {
    upColor: '#16a34a',
    downColor: '#dc2626',
    borderUpColor: '#16a34a',
    borderDownColor: '#dc2626',
    wickUpColor: '#16a34a',
    wickDownColor: '#dc2626',
  };

  const emaBase = {
    lineWidth: 2,
    // keep axis clean
    lastValueVisible: false,
    priceLineVisible: false,
  };
  const ema12Opts = { ...emaBase, color: '#ef4444' };
  const ema26Opts = { ...emaBase, color: '#2563eb' };
  const ema200Opts = { ...emaBase, color: '#f59e0b' };

  // Lightweight Charts v4/v5 compatibility
  if (typeof chartApi.addCandlestickSeries === 'function') {
    candleSeries = chartApi.addCandlestickSeries(candleOpts);
    ema12Series = chartApi.addLineSeries(ema12Opts);
    ema26Series = chartApi.addLineSeries(ema26Opts);
    ema200Series = chartApi.addLineSeries(ema200Opts);
  } else if (typeof chartApi.addSeries === 'function') {
    candleSeries = chartApi.addSeries(LightweightCharts.CandlestickSeries, candleOpts);
    ema12Series = chartApi.addSeries(LightweightCharts.LineSeries, ema12Opts);
    ema26Series = chartApi.addSeries(LightweightCharts.LineSeries, ema26Opts);
    ema200Series = chartApi.addSeries(LightweightCharts.LineSeries, ema200Opts);
  } else {
    throw new Error('Unsupported Lightweight Charts API version');
  }

  window.addEventListener('resize', () => {
    const r = DOM.chartHost.getBoundingClientRect();
    chartApi.applyOptions({ width: r.width, height: r.height });
  });
}

async function bootstrapMarketData() {
  try {
    const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=30m&limit=500';
    const res = await fetch(url);
    const rows = await res.json();

    STATE.candles = rows.map((k) => ({
      time: Math.floor(k[0] / 1000),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
    }));

    const last = STATE.candles[STATE.candles.length - 1];
    STATE.livePrice = last?.close || 0;
    if (STATE.referencePlan?.enabled) STATE.referencePlan.currentPrice = STATE.livePrice;

    runIndicatorEngine();
    renderChart();

    // refresh candles periodically
    setInterval(refreshCandles, 30_000);
  } catch (e) {
    console.error('Failed to bootstrap OHLC:', e);
    DOM.indicatorStatus.textContent = 'Indicator engine: data error';
  }
}

async function refreshCandles() {
  try {
    const url = 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=30m&limit=500';
    const res = await fetch(url);
    const rows = await res.json();
    STATE.candles = rows.map((k) => ({
      time: Math.floor(k[0] / 1000),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
    }));
    const last = STATE.candles[STATE.candles.length - 1];
    STATE.livePrice = last?.close || STATE.livePrice;
    if (STATE.referencePlan?.enabled) STATE.referencePlan.currentPrice = STATE.livePrice;
    runIndicatorEngine();
    renderChart();
    if (STATE.position) updateLivePnL();
    updateUI();
  } catch (e) {
    console.error('Candle refresh failed:', e);
  }
}

function setupLivePriceSocket() {
  const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const price = parseFloat(data.p);

    const prevPrice = STATE.livePrice;
    STATE.livePrice = price;
    if (STATE.referencePlan?.enabled) {
      STATE.referencePlan.currentPrice = price;
      renderReferencePlanOverlay();
    }
    DOM.livePrice.innerText = formatCurrency(price);

    if (price > prevPrice) DOM.livePrice.style.color = 'var(--color-success)';
    else if (price < prevPrice) DOM.livePrice.style.color = 'var(--color-error)';

    setTimeout(() => {
      DOM.livePrice.style.color = 'var(--text-primary)';
    }, 400);

    if (STATE.position) updateLivePnL();
  };

  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };
}

// --- Indicator Engine (Pine -> JS adaptation) ---
function ema(values, period) {
  if (!values.length) return [];
  const k = 2 / (period + 1);
  const out = [];
  let prev = values[0];
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

function buildHeikinAshi(candles) {
  if (!candles.length) return [];
  const out = [];
  let prevHaOpen = (candles[0].open + candles[0].close) / 2;
  let prevHaClose = (candles[0].open + candles[0].high + candles[0].low + candles[0].close) / 4;

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    const haOpen = i === 0 ? prevHaOpen : (prevHaOpen + prevHaClose) / 2;
    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    out.push({ time: c.time, open: haOpen, high: haHigh, low: haLow, close: haClose });

    prevHaOpen = haOpen;
    prevHaClose = haClose;
  }

  return out;
}

function runIndicatorEngine() {
  const c = buildHeikinAshi(STATE.candles);
  if (c.length < 210) return;

  const closes = c.map((x) => x.close);
  const highs = c.map((x) => x.high);
  const lows = c.map((x) => x.low);

  const ema12 = ema(closes, STATE.indicator.xprd1);
  const ema26 = ema(closes, STATE.indicator.xprd2);
  const ema200 = ema(closes, STATE.indicator.xprd200);

  STATE.signals = [];
  STATE.alerts = [];

  const p = STATE.indicator.masterCandlePeriod;
  const stopTicks = STATE.indicator.stopLossTicks;
  const mintick = 0.1; // BTCUSDT practical tick

  for (let i = p; i < c.length; i++) {
    const m = i - p;
    const masterHigh = highs[m];
    const masterLow = lows[m];

    let isMaster = true;
    for (let j = 1; j <= p; j++) {
      const k = i - j;
      if (highs[k] > masterHigh || lows[k] < masterLow) {
        isMaster = false;
        break;
      }
    }

    if (!isMaster) continue;

    const buySignal = closes[i] > masterHigh;
    const sellSignal = closes[i] < masterLow;

    if (buySignal) {
      const stopLoss = masterLow - stopTicks * mintick;
      const signal = { type: 'BUY', time: c[i].time, price: c[i].low, stopLoss };
      STATE.signals.push(signal);
      STATE.alerts.unshift(`${fmtTime(c[i].time)} BUY breakout • Stop ${stopLoss.toFixed(1)}`);
      // Update latest signal
      STATE.latestSignal = { ...signal, alertType: 'BUY breakout' };
    }

    if (sellSignal) {
      const stopLoss = masterHigh + stopTicks * mintick;
      const signal = { type: 'SELL', time: c[i].time, price: c[i].high, stopLoss };
      STATE.signals.push(signal);
      STATE.alerts.unshift(`${fmtTime(c[i].time)} SELL breakout • Stop ${stopLoss.toFixed(1)}`);
      // Update latest signal
      STATE.latestSignal = { ...signal, alertType: 'SELL breakout' };
    }

    // Trend alerts from EMA 12/26 state
    if (i > 0) {
      const wasBull = ema12[i - 1] > ema26[i - 1];
      const isBull = ema12[i] > ema26[i];
      if (!wasBull && isBull) {
        STATE.alerts.unshift(`${fmtTime(c[i].time)} Trend changed: BULLISH`);
        STATE.latestSignal = { time: c[i].time, type: 'TREND', trend: 'BULLISH', alertType: 'Trend changed: BULLISH' };
      }
      if (wasBull && !isBull) {
        STATE.alerts.unshift(`${fmtTime(c[i].time)} Trend changed: BEARISH`);
        STATE.latestSignal = { time: c[i].time, type: 'TREND', trend: 'BEARISH', alertType: 'Trend changed: BEARISH' };
      }
    }
  }

  STATE.alerts = STATE.alerts.slice(0, 20);

  // Bar color logic (EMA regime coloring adapted from Pine)
  const candleData = c.map((x, i) => {
    const bull = ema12[i] > ema26[i];
    const bear = ema12[i] < ema26[i];
    const xPrice = x.close;

    const green = bull && xPrice > ema12[i];
    const blue = bear && xPrice > ema12[i] && xPrice > ema26[i];
    const lblue = bear && xPrice > ema12[i] && xPrice < ema26[i];
    const red = bear && xPrice < ema12[i];
    const orange = bull && xPrice < ema12[i] && xPrice < ema26[i];
    const yellow = bull && xPrice < ema12[i] && xPrice > ema26[i];

    let color = '#64748b';
    if (green) color = '#16a34a';
    else if (blue) color = '#2563eb';
    else if (lblue) color = '#06b6d4';
    else if (red) color = '#dc2626';
    else if (orange) color = '#f97316';
    else if (yellow) color = '#eab308';

    return {
      time: x.time,
      open: x.open,
      high: x.high,
      low: x.low,
      close: x.close,
      color,
      wickColor: color,
      borderColor: color,
    };
  });

  STATE._render = {
    candleData,
    ema12: c.map((x, i) => ({ time: x.time, value: ema12[i] })),
    ema26: c.map((x, i) => ({ time: x.time, value: ema26[i] })),
    ema200: c.map((x, i) => ({ time: x.time, value: ema200[i] })),
  };

  const trendNow = ema12.at(-1) > ema26.at(-1) ? 'BULLISH' : 'BEARISH';
  const latestPos = getLatestSignalPosition();
  
  // Show latest signal from alerts if available
  if (STATE.latestSignal) {
    const sig = STATE.latestSignal;
    if (sig.alertType) {
      DOM.indicatorStatus.textContent = `Latest signal: ${sig.alertType}`;
    } else if (latestPos) {
      DOM.indicatorStatus.textContent = `HA 30m • ${latestPos.side} latest • SL ${latestPos.stopLoss.toFixed(1)} • TP ${latestPos.takeProfit.toFixed(1)} • RR 1:${latestPos.rr}`;
    } else {
      DOM.indicatorStatus.textContent = `HA 30m active • Trend ${trendNow} • Signals ${STATE.signals.length}`;
    }
  } else if (latestPos) {
    DOM.indicatorStatus.textContent = `HA 30m • ${latestPos.side} latest • SL ${latestPos.stopLoss.toFixed(1)} • TP ${latestPos.takeProfit.toFixed(1)} • RR 1:${latestPos.rr}`;
  } else {
    DOM.indicatorStatus.textContent = `HA 30m active • Trend ${trendNow} • Signals ${STATE.signals.length}`;
  }
  renderAlerts();
  forwardLatestAlertToBridge();
}

function clearReferencePlanLines() {
  for (const line of referencePlanLines) {
    try { candleSeries.removePriceLine(line); } catch (_) {}
  }
  referencePlanLines = [];
}

function addPlanLine(price, color, title) {
  const line = candleSeries.createPriceLine({
    price,
    color,
    lineWidth: 2,
    lineStyle: LightweightCharts.LineStyle.Dashed,
    axisLabelVisible: true,
    title,
  });
  referencePlanLines.push(line);
}

function getLatestSignalPosition() {
  if (!STATE.signals.length) return null;
  const s = STATE.signals[STATE.signals.length - 1]; // latest by candle order
  const entry = s.price;
  const stopLoss = s.stopLoss;
  const rr = STATE.referencePlan.rr || 2.5;
  const risk = Math.abs(entry - stopLoss);
  if (risk <= 0) return null;

  const side = s.type === 'BUY' ? 'LONG' : 'SHORT';
  const takeProfit = side === 'LONG' ? entry + risk * rr : entry - risk * rr;

  return { side, entry, stopLoss, takeProfit, rr, time: s.time };
}

function renderReferencePlanOverlay() {
  clearReferencePlanLines();
  const p = STATE.referencePlan;
  if (!p?.enabled) return;

  const pos = getLatestSignalPosition();
  if (!pos) return;

  // Keep only SL + TP (+ current for context)
  addPlanLine(pos.stopLoss, '#dc2626', `SL ${pos.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 1 })}`);
  addPlanLine(pos.takeProfit, '#16a34a', `TP ${pos.takeProfit.toLocaleString(undefined, { maximumFractionDigits: 1 })} • RR 1:${pos.rr}`);
}

function renderChart() {
  if (!STATE._render) return;

  candleSeries.setData(STATE._render.candleData);
  ema12Series.setData(STATE._render.ema12);
  ema26Series.setData(STATE._render.ema26);
  ema200Series.setData(STATE._render.ema200);

  const signalMarkers = STATE.signals.map((s) => ({
    time: s.time,
    position: s.type === 'BUY' ? 'belowBar' : 'aboveBar',
    color: s.type === 'BUY' ? '#16a34a' : '#dc2626',
    shape: s.type === 'BUY' ? 'arrowUp' : 'arrowDown',
    text: `${s.type} • SL ${s.stopLoss.toFixed(1)}`,
  }));

  const latestPos = getLatestSignalPosition();
  const planMarkers = latestPos
    ? [
        {
          time: latestPos.time,
          position: latestPos.side === 'LONG' ? 'belowBar' : 'aboveBar',
          color: latestPos.side === 'LONG' ? '#16a34a' : '#dc2626',
          shape: latestPos.side === 'LONG' ? 'arrowUp' : 'arrowDown',
          text: `${latestPos.side} (latest signal)`,
        },
      ]
    : [];

  const markers = [...signalMarkers, ...planMarkers];

  if (typeof candleSeries.setMarkers === 'function') {
    candleSeries.setMarkers(markers);
  } else if (typeof LightweightCharts.createSeriesMarkers === 'function') {
    LightweightCharts.createSeriesMarkers(candleSeries, markers);
  }

  renderReferencePlanOverlay();

  const total = STATE._render.candleData.length;
  chartApi.timeScale().setVisibleLogicalRange({
    from: Math.max(0, total - 140),
    to: total + 5,
  });
}

function renderAlerts() {
  DOM.alertList.innerHTML = '';
  if (!STATE.alerts.length) {
    DOM.alertList.innerHTML = '<li class="empty-state">No indicator alerts yet.</li>';
    return;
  }
  STATE.alerts.forEach((a) => {
    const li = document.createElement('li');
    li.className = 'indicator-alert-item';
    li.textContent = a;
    DOM.alertList.appendChild(li);
  });
}

async function captureAndSendChart() {
  if (!chartApi) return;
  try {
    // Show feedback
    DOM.btnScreenshot.style.opacity = '0.5';

    // Capture chart using lightweight-charts screenshot
    const dataUrl = chartApi.takeScreenshot();

    // Convert to blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    // Send to bridge
    const form = new FormData();
    form.append('image', blob, 'chart.png');
    form.append('caption', `Trading Simulator Chart - ${new Date().toLocaleString('th-TH')}`);

    const uploadRes = await fetch(`${STATE.bridgeUrl}/screenshot`, {
      method: 'POST',
      body: form,
    });

    if (uploadRes.ok) {
      alert('Chart captured and sent to Telegram!');
    } else {
      const err = await uploadRes.text();
      console.error('Screenshot upload failed:', err);
      alert('Failed to send chart. See console.');
    }
  } catch (e) {
    console.error('Screenshot capture failed:', e);
    alert('Screenshot failed: ' + e.message);
  } finally {
    DOM.btnScreenshot.style.opacity = '1';
  }
}

async function forwardLatestAlertToBridge() {
  if (!STATE.alerts.length) return;
  const latest = STATE.alerts[0];
  if (!latest || latest === STATE.lastForwardedAlert) return;

  const latestPos = getLatestSignalPosition();

  try {
    await fetch(STATE.bridgeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert: latest,
        position: latestPos,
        simulationUrl: STATE.simulationUrl,
        ts: Date.now(),
      }),
    });
    STATE.lastForwardedAlert = latest;
  } catch (e) {
    // Silent fail: bridge may not be running yet.
    console.warn('Alert bridge unavailable:', e?.message || e);
  }
}

// --- Trading Logic ---
function openPosition(type) {
  if (STATE.position) {
    alert('You already have an open position! Close it first.');
    return;
  }

  if (STATE.livePrice <= 0) {
    alert('Waiting for live price feed...');
    return;
  }

  const sizeUsd = parseFloat(DOM.tradeAmountInput.value);
  if (isNaN(sizeUsd) || sizeUsd <= 0) {
    alert('Please enter a valid trade amount.');
    return;
  }

  const requiredMargin = sizeUsd / STATE.leverage;
  if (requiredMargin > STATE.balance) {
    alert(`Insufficient balance! Need margin ${formatCurrency(requiredMargin)} at ${STATE.leverage}x.`);
    return;
  }

  STATE.position = {
    type,
    entryPrice: STATE.livePrice,
    sizeUsd,
    openTime: new Date(),
  };

  DOM.btnBuy.disabled = true;
  DOM.btnSell.disabled = true;
  DOM.tradeAmountInput.disabled = true;
  updateActivePositionUI();
}

function closePosition() {
  if (!STATE.position) return;

  const pnlResult = calculatePnL();
  const isWin = pnlResult.pnlUsd > 0;

  const tradeRecord = {
    id: generateId(),
    type: STATE.position.type,
    entryPrice: STATE.position.entryPrice,
    exitPrice: STATE.livePrice,
    sizeUsd: STATE.position.sizeUsd,
    pnlUsd: pnlResult.pnlUsd,
    pnlPercent: pnlResult.pnlPercent,
    openTime: STATE.position.openTime,
    closeTime: new Date(),
  };

  STATE.balance += pnlResult.pnlUsd;
  if (STATE.balance > STATE.peakBalance) STATE.peakBalance = STATE.balance;

  STATE.trades.push(tradeRecord);
  if (isWin) STATE.wins++;
  else STATE.losses++;

  if (pnlResult.pnlUsd > STATE.bestTrade) STATE.bestTrade = pnlResult.pnlUsd;
  if (pnlResult.pnlUsd < STATE.worstTrade) STATE.worstTrade = pnlResult.pnlUsd;

  const currentDrawdown = ((STATE.peakBalance - STATE.balance) / STATE.peakBalance) * 100;
  if (currentDrawdown > STATE.maxDrawdown) STATE.maxDrawdown = currentDrawdown;

  STATE.position = null;
  DOM.btnBuy.disabled = false;
  DOM.btnSell.disabled = false;
  DOM.tradeAmountInput.disabled = false;
  DOM.positionPanel.classList.add('hidden');

  appendTradeToLogger(tradeRecord);
  saveToStorage();
  updateUI();
}

function calculatePnL() {
  if (!STATE.position) return { pnlUsd: 0, pnlPercent: 0 };

  const currentPrice = STATE.livePrice;
  const entryPrice = STATE.position.entryPrice;
  const size = STATE.position.sizeUsd;

  const priceDiffPercent = (currentPrice - entryPrice) / entryPrice;
  const pnlPercent = STATE.position.type === 'LONG' ? priceDiffPercent : -priceDiffPercent;
  const pnlUsd = size * pnlPercent;

  return { pnlUsd, pnlPercent: pnlPercent * 100 };
}

// --- UI Updaters ---
function updateLivePnL() {
  if (!STATE.position) return;
  const pnlResult = calculatePnL();

  const isProfit = pnlResult.pnlUsd >= 0;
  const sign = isProfit ? '+' : '';

  DOM.openPnl.innerHTML = `${sign}${formatCurrency(pnlResult.pnlUsd)} <small>(${sign}${pnlResult.pnlPercent.toFixed(2)}%)</small>`;
  DOM.openPnl.className = `pnl-value ${isProfit ? 'success' : 'error'}`;
}

function updateActivePositionUI() {
  if (!STATE.position) return;

  DOM.positionPanel.classList.remove('hidden');
  DOM.typeBadge.innerText = STATE.position.type;
  DOM.typeBadge.className = `badge ${STATE.position.type === 'LONG' ? 'bg-success' : 'bg-error'}`;

  DOM.entryPrice.innerText = formatCurrency(STATE.position.entryPrice);
  DOM.positionSize.innerText = formatCurrency(STATE.position.sizeUsd);

  const t = STATE.position.openTime;
  DOM.openTime.innerText = `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;

  updateLivePnL();
}

function updateUI() {
  DOM.balance.innerText = formatCurrency(STATE.balance);

  if (STATE.balance > STATE.startingBalance) {
    DOM.balance.classList.add('success');
    DOM.balance.classList.remove('error');
  } else if (STATE.balance < STATE.startingBalance) {
    DOM.balance.classList.add('error');
    DOM.balance.classList.remove('success');
  } else {
    DOM.balance.classList.remove('success', 'error');
  }

  const totalTrades = STATE.trades.length;
  const winRate = totalTrades > 0 ? ((STATE.wins / totalTrades) * 100).toFixed(1) : 0;

  DOM.winRate.innerHTML = `${winRate}% <small>${STATE.wins} / ${totalTrades}</small>`;
  DOM.maxDrawdown.innerText = `-${STATE.maxDrawdown.toFixed(2)}%`;
  DOM.bestTrade.innerText = `+${formatCurrency(STATE.bestTrade)}`;
  DOM.worstTrade.innerText = `${STATE.worstTrade < 0 ? '-' : ''}${formatCurrency(Math.abs(STATE.worstTrade))}`;
  DOM.totalTrades.innerText = `${totalTrades} entries`;

  if (totalTrades === 0) {
    DOM.historyList.innerHTML = `<li class="empty-state">No trades executed yet.</li>`;
  }

  if (STATE.livePrice > 0) DOM.livePrice.innerText = formatCurrency(STATE.livePrice);
}

// --- localStorage Persistence ---
const STORAGE_KEY = 'trading_simulator_data';

function saveToStorage() {
  const data = {
    balance: STATE.balance,
    startingBalance: STATE.startingBalance,
    trades: STATE.trades.map(t => ({
      ...t,
      openTime: t.openTime.toISOString(),
      closeTime: t.closeTime.toISOString()
    })),
    wins: STATE.wins,
    losses: STATE.losses,
    bestTrade: STATE.bestTrade,
    worstTrade: STATE.worstTrade,
    maxDrawdown: STATE.maxDrawdown,
    peakBalance: STATE.peakBalance
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    const data = JSON.parse(saved);
    
    STATE.balance = data.balance ?? 99.62;
    STATE.startingBalance = data.startingBalance ?? 99.62;
    STATE.trades = (data.trades || []).map(t => ({
      ...t,
      openTime: new Date(t.openTime),
      closeTime: new Date(t.closeTime)
    }));
    STATE.wins = data.wins ?? 0;
    STATE.losses = data.losses ?? 0;
    STATE.bestTrade = data.bestTrade ?? 0;
    STATE.worstTrade = data.worstTrade ?? 0;
    STATE.maxDrawdown = data.maxDrawdown ?? 0;
    STATE.peakBalance = data.peakBalance ?? 99.62;
    
    return true;
  } catch (e) {
    console.error('Failed to load from storage:', e);
    return false;
  }
}

function renderTradeList() {
  if (STATE.trades.length === 0) {
    DOM.historyList.innerHTML = '<li class="empty-state">No trades executed yet.</li>';
    return;
  }
  
  DOM.historyList.innerHTML = '';
  STATE.trades.forEach((trade, index) => {
    appendTradeToLogger(trade, index);
  });
}

function appendTradeToLogger(trade, index = null) {
  if (index === null) index = STATE.trades.length - 1;
  
  const isProfit = trade.pnlUsd >= 0;
  const sign = isProfit ? '+' : '';
  const colorClass = isProfit ? 'success' : 'error';
  const typeClass = trade.type === 'LONG' ? 'long' : 'short';
  const timeStr = `${pad2(trade.closeTime.getHours())}:${pad2(trade.closeTime.getMinutes())}`;
  const dateStr = `${trade.closeTime.getMonth() + 1}/${trade.closeTime.getDate()}`;

  const li = document.createElement('li');
  li.className = 'history-item';
  li.dataset.tradeIndex = index;
  li.innerHTML = `
    <div class="hi-main">
      <span class="hi-type ${typeClass}">${trade.type}</span>
      <span class="hi-prices">$${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ➔ $${trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
    <div class="hi-result">
      <span class="hi-pnl ${colorClass}">${sign}${formatCurrency(trade.pnlUsd)}</span>
      <span class="hi-time">${dateStr} ${timeStr}</span>
    </div>
    <div class="hi-actions">
      <button class="hi-btn edit" onclick="editTrade(${index})" title="Edit">✏️</button>
      <button class="hi-btn delete" onclick="deleteTrade(${index})" title="Delete">🗑️</button>
    </div>
  `;

  DOM.historyList.prepend(li);
}

function editTrade(index) {
  const trade = STATE.trades[index];
  if (!trade) return;
  
  const newEntry = prompt(`Edit Entry Price (current: ${trade.entryPrice}):`, trade.entryPrice);
  if (newEntry === null) return;
  
  const newExit = prompt(`Edit Exit Price (current: ${trade.exitPrice}):`, trade.exitPrice);
  if (newExit === null) return;
  
  const newPnl = prompt(`Edit PnL USD (current: ${trade.pnlUsd}):`, trade.pnlUsd);
  if (newPnl === null) return;
  
  // Update trade
  const oldPnl = trade.pnlUsd;
  trade.entryPrice = parseFloat(newEntry);
  trade.exitPrice = parseFloat(newExit);
  trade.pnlUsd = parseFloat(newPnl);
  
  // Recalculate derived values
  trade.pnlPercent = (trade.pnlUsd / trade.sizeUsd) * 100;
  
  // Update state stats
  STATE.balance = STATE.balance - oldPnl + trade.pnlUsd;
  if (trade.pnlUsd > STATE.bestTrade) STATE.bestTrade = trade.pnlUsd;
  if (trade.pnlUsd < STATE.worstTrade) STATE.worstTrade = trade.pnlUsd;
  
  // Recalculate wins/losses
  STATE.wins = STATE.trades.filter(t => t.pnlUsd > 0).length;
  STATE.losses = STATE.trades.filter(t => t.pnlUsd <= 0).length;
  
  saveToStorage();
  renderTradeList();
  updateUI();
  
  alert('Trade updated!');
}

function deleteTrade(index) {
  if (!confirm('Are you sure you want to delete this trade?')) return;
  
  const trade = STATE.trades[index];
  if (!trade) return;
  
  // Remove trade and adjust balance
  STATE.balance -= trade.pnlUsd;
  STATE.trades.splice(index, 1);
  
  // Recalculate stats
  STATE.wins = STATE.trades.filter(t => t.pnlUsd > 0).length;
  STATE.losses = STATE.trades.filter(t => t.pnlUsd <= 0).length;
  STATE.bestTrade = STATE.trades.length > 0 ? Math.max(...STATE.trades.map(t => t.pnlUsd)) : 0;
  STATE.worstTrade = STATE.trades.length > 0 ? Math.min(...STATE.trades.map(t => t.pnlUsd)) : 0;
  
  saveToStorage();
  renderTradeList();
  updateUI();
  
  alert('Trade deleted!');
}

function seedInitialTradeData() {
  if (STATE.trades.length > 0) return;

  const seededTrade = {
    id: 'seed-2026-02-23-1',
    type: 'SHORT',
    entryPrice: 67653.29,
    exitPrice: 67061.4,
    // Notional lot size (Coin-M style with leverage context)
    sizeUsd: 1758.74,
    pnlUsd: 15.38,
    pnlPercent: (15.38 / 1758.74) * 100,
    openTime: new Date('2026-02-23T07:30:00'),
    closeTime: new Date('2026-02-23T07:49:51'),
  };

  STATE.trades.push(seededTrade);
  STATE.wins = 1;
  STATE.losses = 0;
  STATE.bestTrade = seededTrade.pnlUsd;
  STATE.worstTrade = 0;
  STATE.balance = STATE.startingBalance + seededTrade.pnlUsd;
  STATE.peakBalance = STATE.balance;

  DOM.historyList.innerHTML = '';
  appendTradeToLogger(seededTrade);
}

function resetSimulator() {
  if (confirm('Are you sure you want to reset the simulator? All history will be lost.')) {
    STATE.balance = 99.62;
    STATE.startingBalance = 99.62;
    STATE.position = null;
    STATE.trades = [];
    STATE.wins = 0;
    STATE.losses = 0;
    STATE.bestTrade = 0;
    STATE.worstTrade = 0;
    STATE.maxDrawdown = 0;
    STATE.peakBalance = 99.62;

    DOM.btnBuy.disabled = false;
    DOM.btnSell.disabled = false;
    DOM.tradeAmountInput.disabled = false;
    DOM.positionPanel.classList.add('hidden');
    DOM.historyList.innerHTML = `<li class="empty-state">No trades executed yet.</li>`;

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    updateUI();
  }
}

// --- Utils ---
function formatCurrency(num) {
  return '$' + Number(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function fmtTime(sec) {
  const d = new Date(sec * 1000);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

init();
