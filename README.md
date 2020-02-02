# connectedDots
Animation of connected dots

### How to Use:

embed the following at the end of your body tag and replace the variables in runAnimation with things you like (runAnimation parameters in order: htmltarget, dotSize, strokeWidth, color, dotOpacity)

<script src="https://cdn.jsdelivr.net/gh/circular-code/connectedDots@master/app.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    runAnimation(document.getElementById('canvas'), 3, 0.5, "rgba(0,0,0,0.5)", 0.1);
  });
</script>
