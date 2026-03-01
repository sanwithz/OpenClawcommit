# QuickChart Skill

Generate charts and QR codes as PNG images using QuickChart.io for easy sharing on Telegram.

## QR Code Generator

Base URL:
```
https://quickchart.io/qr?text=YOUR_TEXT
```

### Basic QR Code
```
https://quickchart.io/qr?text=Hello%20World
```

### QR with Custom Size
```
https://quickchart.io/qr?text=https://example.com&size=300
```

### QR with Error Correction
```
https://quickchart.io/qr?text=Important%20Data&ecLevel=H
```

**Parameters:**
- `text` - Content to encode (URL encode special chars)
- `size` - Image size in pixels (default: 128)
- `ecLevel` - Error correction: L, M, Q, H (default: M)
- `margin` - Margin around QR code (default: 4)
- `dark` - Dark color (default: 000000)
- `light` - Light color (default: ffffff)

## Chart Generator

Base URL:
```
https://quickchart.io/chart?c={CHART_CONFIG}
```

## Examples

### Simple Bar Chart
```
https://quickchart.io/chart?c={type:'bar',data:{labels:['A','B'],datasets:[{data:[10,20]}]}}
```

### Multi-Dataset Bar Chart
```
https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2','Q3','Q4'],datasets:[{label:'Users',data:[50,60,70,180]},{label:'Revenue',data:[100,200,300,400]}]}}
```

### Pie Chart
```
https://quickchart.io/chart?c={type:'pie',data:{labels:['Buy','Sell'],datasets:[{data:[60,40]}]}}
```

### Styled Pie with Custom Colors
```
https://quickchart.io/chart?c={type:'pie',data:{labels:['A','B','C'],datasets:[{backgroundColor:['#FF3784','#36A2EB','#4BC0C0'],data:[30,50,20]}]}}
```

### Outlabeled Pie (Labels Outside)
```
https://quickchart.io/chart?c={type:'outlabeledPie',data:{labels:['ONE','TWO','THREE'],datasets:[{backgroundColor:['#FF3784','#36A2EB','#4BC0C0'],data:[1,2,3]}]},options:{plugins:{legend:false,outlabels:{text:'%l %p',color:'white',stretch:35}}}}
```

### Line Chart
```
https://quickchart.io/chart?c={type:'line',data:{labels:['Jan','Feb','Mar'],datasets:[{label:'Sales',data:[100,200,150],borderColor:'#36A2EB',fill:false}]}}
```

### Doughnut Chart
```
https://quickchart.io/chart?c={type:'doughnut',data:{labels:['Red','Blue','Yellow'],datasets:[{backgroundColor:['#FF6384','#36A2EB','#FFCE56'],data:[300,50,100]}]}}
```

### Line Chart with Annotations
```
https://quickchart.io/chart?c={type:'line',data:{labels:[1,2,3,4,5],datasets:[{label:'Rainfall',data:[200,90,120,400,500],fill:false,borderColor:'green'}]},options:{annotation:{annotations:[{type:'line',mode:'vertical',scaleID:'x-axis-0',value:2,borderColor:'red',borderWidth:4,label:{enabled:true,content:'Event'}},{type:'box',xScaleID:'x-axis-0',yScaleID:'y-axis-0',xMin:3,xMax:5,backgroundColor:'rgba(200,200,200,0.2)'}]}}}
```

## Supported Chart Types
- `bar` - Bar chart
- `line` - Line chart
- `pie` - Pie chart
- `outlabeledPie` - Pie with external labels (%l = label, %p = percent)
- `doughnut` - Doughnut chart
- `radar` - Radar chart
- `polarArea` - Polar area chart

## Customization Options
- `backgroundColor` - Array of colors for each segment
- `borderColor` - Line color for line charts
- `options.plugins.legend` - Show/hide legend
- `options.plugins.outlabels` - External label styling
- `options.plugins.datalabels` - Show values on chart points
- `options.annotation.annotations` - Add vertical lines, boxes, highlights
- `fill` - Fill area under line (true/false)
- `w`, `h` - Width/height parameters
- `bkg` - Background color (e.g., `bkg=white`)

## URL Encoding Tips
- Spaces → remove or use `%20`
- `#` → `%23`
- Special chars in labels → encode properly
- Keep config compact (no unnecessary spaces)

## Send to Telegram

```javascript
message({
  action: 'send',
  media: 'https://quickchart.io/chart?c={CHART_CONFIG}'
})
```

## Documentation
https://quickchart.io/documentation
