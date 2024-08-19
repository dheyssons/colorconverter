import {getColorContrast} from './getColorContrast.js';
const colorInputs = document.querySelectorAll('#InputColor');
const body = document.body;

const changeLightMode = (currentColor) => {
    //console.log(currentColor)
  
    if (getColorContrast(currentColor) === "light") {
      //console.log("current is LIGHT - changing to DARK")
      
      body.classList.add("dark")
      body.classList.remove("light")

      for (var i = 0; i < colorInputs.length; i++) {
        colorInputs[i].classList.add("dark")
        colorInputs[i].classList.remove("light")
      }
      
    } else if (getColorContrast(currentColor) === "dark") {
      //console.log("current is DARK - changing to LIGHT")

      body.classList.add("light")
      body.classList.remove("dark")

      for (var i = 0; i < colorInputs.length; i++) {
        colorInputs[i].classList.add("light")
        colorInputs[i].classList.remove("dark")
      }
    }
};

const changeBackgroundColor = (color, colorSpace) => {
  switch (colorSpace) {
    case 'hex':
      if (colorInputs[0].value === '') {
        document.body.style.backgroundColor = '#fff';
      }
      if (colorInputs[0].value[0] === '#') {
        document.body.style.backgroundColor = `${colorInputs[0].value}`;
      } else {
        document.body.style.backgroundColor = `#${colorInputs[0].value}`;
      }
      break;

    case 'rgb':
      let trueRGB = color;
      trueRGB = trueRGB.replace(/(rgb)|\(|\)/g,'');
      trueRGB = trueRGB.split(',');

      document.body.style.backgroundColor = `rgb(${trueRGB[0]}, ${trueRGB[1]}, ${trueRGB[2]})`;
      break;

    case 'hsl':

      let hsl = color;
      console.log(hsl)

      let _hsl = hsl.replace(/(hsl)|\(|\)|\°|\%/g,'')
      _hsl = _hsl.split(',')
      console.log(_hsl[0])

      document.body.style.backgroundColor = `hsl(${_hsl[0]}, ${_hsl[1]}%,${_hsl[2]}%)`
      break;

    case 'cmyk':
      let rgb = color;
      rgb = rgb.replace(/(cmyk)|\(|\)/g,'');
      rgb = rgb.split(',');

      let _rgb = cmykToRGB(rgb[0], rgb[1], rgb[2], rgb[3], false);
      document.body.style.backgroundColor = `rgb(${_rgb.r}, ${_rgb.g}, ${_rgb.b})`;
      break;
  }
};

const converterColorValues = (rgb, inputName) => {
  if (rgb) {
    const inputs = document.querySelectorAll('input');

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].style.backgroundColor = rgb;
    }

    inputs[0].value = rgbToHex(rgb);
    inputs[1].value = rgb;

    if (inputName !== 'hsl') {
      inputs[2].value = hexToHSL(rgbToHex(rgb));
    } else {
      let hsl = hexToHSL(rgbToHex(rgb));
      let _hsl = hsl.replace(/hsl|\(|\)/g,'');
      _hsl = _hsl.split(',');
      
      inputs[2].value = `HSL(${_hsl[0]}, ${_hsl[1]}, ${_hsl[2]})`
      console.log(hsl);
    }

    if (inputName !== 'cmyk') {
      let cmyk = splitRGB(rgb);
      inputs[3].value = `cmyk(${Math.round(cmyk.c)}, ${Math.round(cmyk.m)}, ${Math.round(cmyk.y)}, ${Math.round(cmyk.k)})`;
    } else {
      let _cmyk = inputs[3].value;
      _cmyk = _cmyk.replace(/cmyk\(|\)/g,'');
      _cmyk = _cmyk.replace(' ','');
      _cmyk = _cmyk.replace(' ','');
      _cmyk = _cmyk.replace(' ','');
      _cmyk = _cmyk.split(',');

      inputs[3].value = `cmyk(${Math.round(_cmyk[0])}, ${Math.round(_cmyk[1])}, ${Math.round(_cmyk[2])}, ${Math.round(_cmyk[3])})`
    }

  }  
}

const cmykToRGB = (c, m, y, k, normalized) => {
  c = (c / 100);
  m = (m / 100);
  y = (y / 100);
  k = (k / 100);
  c = c * (1 - k) + k;
  m = m * (1 - k) + k;
  y = y * (1 - k) + k;
  let r = 1 - c;
  let g = 1 - m;
  let b = 1 - y;
  if (!normalized) {
    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);
  }
  return {
    r: r,
    g: g,
    b: b,
  };
};

const rgbToHex = (rgb) => {
    return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
        .slice(1).map((n) => parseInt(n, 10).toString(16)
            .padStart(2, '0')).join('')}`;
};

const hexToHSL = (hex) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (hex.length === 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length === 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsl(${h}°, ${s}%, ${l}%)`;
};

const rgbToCMYK = (r, g, b, normalized) => {
  var c = 1 - (r / 255);
  var m = 1 - (g / 255);
  var y = 1 - (b / 255);
  var k = Math.min(c, Math.min(m, y));
  
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  
  if(!normalized){
      c = Math.round(c * 10000) / 100;
      m = Math.round(m * 10000) / 100;
      y = Math.round(y * 10000) / 100;
      k = Math.round(k * 10000) / 100;
  }
  
  c = isNaN(c) ? 0 : c;
  m = isNaN(m) ? 0 : m;
  y = isNaN(y) ? 0 : y;
  k = isNaN(k) ? 0 : k;
  
  return {
       c: c,
       m: m,
       y: y,
       k: k
  }
};

const splitRGB = (color) => {
  let rgb = color;

  rgb = rgb.replace(/rgb|\(|\)/g,'');
  rgb = rgb.replace(' ','');
  rgb = rgb.replace(' ','');
  rgb = rgb.split(',');

  return rgbToCMYK(rgb[0], rgb[1], rgb[2]);
};

colorInputs.forEach((input) => {
  input.addEventListener('change', (ev) => {
    console.log(ev.target);

    changeBackgroundColor(ev.target.value, ev.target.getAttribute('name'));
    converterColorValues(document.body.style.backgroundColor, ev.target.getAttribute('name'));
    changeLightMode(body.style.backgroundColor);
  });
});

document.querySelectorAll('i').forEach((element) => {
  element.addEventListener('click', (ev) => {
    ev.target.classList.toggle('click');

    let index = ev.target.getAttribute('data-index');
    let inputs = document.querySelectorAll('input');

    copyToClipboard(inputs[index].getAttribute('name'));
  });
});

const copyToClipboard = (inputName) => {
  document.querySelector(`[name="${inputName}"`).select();
  document.execCommand('copy');
};

