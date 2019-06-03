# WebFlowVis
Web-based Framework for flow visualization
## Split Screen with Read in Data
### Current Version:
1. Updated files to be split into proper files.
1. Split screen added to compare Three and VTK directly.
1. Slider to change how many lines to render.
1. Organized now with JQuery format.

## VTK vs Three
Performance and Lighting results: https://github.com/duongnb09/WebFlowVis/blob/master/Performance%20and%20Lighting%20tests.pptx  
Three.js Flowchart: https://github.com/duongnb09/WebFlowVis/blob/master/pages/Three.pdf  
VTK.js Flowchart: https://github.com/duongnb09/WebFlowVis/blob/master/pages/VTK.pdf

Notes on Line Render Testing:  
Both Libraries are able to do these renderings quite well. Three.js is more consise and requires less steps to finish the computations, but it does not look as clean as VTK's lines. Then again, Three.js does use a tube or any 2D shape automatically whereas VTK.js requires another set of mappers and actors to add the Tube Filter to the lines. 
test