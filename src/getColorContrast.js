const getColorContrast = (color) => {
  if (color === undefined || color === '') {
    return null;
  }
  const rgbExp = /^rgba?[\s+]?\(\s*(([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]))\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,?(?:\s*([\d.]+))?\s*\)?\s*/im;
  const hexExp = /^(?:#)|([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/igm;
  const rgb = color.match(rgbExp);
  let hex = color.match(hexExp);
  let r;
  let g;
  let b;
  let yiq;
  if (rgb) {
    r = parseInt(rgb[1], 10);
    g = parseInt(rgb[2], 10);
    b = parseInt(rgb[3], 10);
  } else if (hex) {
    if (hex.length > 1) {
      hex = hex[1];
    } else {
      hex = hex[0];
    }
    if (hex.length == 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    return null;
  }
  yiq = ((r*299)+(g*587)+(b*114))/1000;
  return (yiq >= 128) ? 'dark' : 'light';
};

export {getColorContrast};
