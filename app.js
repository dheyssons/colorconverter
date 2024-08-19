import { getColorContrast } from "../getColorContrast.js"

const hex = document.querySelector("#hex")
const body = document.body

hex.addEventListener("change", (ev) => {
    console.log(rgb2hex(body.style.backgroundColor))
  
    ChangeBackgroundColor()
    ChangeLightMode(body.style.backgroundColor)
    //ConverterColorValues(body.style.backgroundColor)
})

const ChangeLightMode = (currentColor) => {
    //console.log(currentColor)
  
    if (getColorContrast(currentColor) === "light") {
      //console.log("current is LIGHT - changing to DARK")
      
      body.classList.add("dark")
      body.classList.remove("light")
      
    } else if (getColorContrast(currentColor) === "dark") {
      //console.log("current is DARK - changing to LIGHT")
      
      body.classList.add("light")
      body.classList.remove("dark")
    }
}

const ChangeBackgroundColor = () => {
    if (hex.value === "") {
      document.body.style.backgroundColor = "#fff";
    }

    if (hex.value[0] === "#") {
        document.body.style.backgroundColor = `${hex.value}`
    } else
        document.body.style.backgroundColor = `#${hex.value}`
}

const HexToRGB = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const rgb2hex = (rgb) => {
  if(rgb) {
    return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2,             '0')).join('')}`
  }
}

const rgb2cmyk = (r,g,b) => {
 var computedC = 0;
 var computedM = 0;
 var computedY = 0;
 var computedK = 0;

 //remove spaces from input RGB values, convert to int
 var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
 var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
 var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

 if ( r==null || g==null || b==null ||
     isNaN(r) || isNaN(g)|| isNaN(b) )
 {
   console.log ('Please enter numeric RGB values!');
   return;
 }
 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
   console.log ('RGB values must be in the range 0 to 255.');
   return;
 }

 // BLACK
 if (r==0 && g==0 && b==0) {
  computedK = 1;
  return [0,0,0,1];
 }

 computedC = 1 - (r/255);
 computedM = 1 - (g/255);
 computedY = 1 - (b/255);

 var minCMY = Math.min(computedC,
              Math.min(computedM,computedY));
 computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
 computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
 computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
 computedK = Math.round(minCMY * 100);

 return {c: computedC,m: computedM,y: computedY,k: computedK};
}

const ConverterColorValues = (currentColor) => {
  
}