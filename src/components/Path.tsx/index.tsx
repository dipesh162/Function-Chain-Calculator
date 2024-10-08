interface PathType {
    path: string;
    strokeWidth: string;
    fill: string;
    stroke: string;
}

function Path({path, strokeWidth, fill, stroke}: PathType) {
  return (
        <path 
            d={path} 
            strokeWidth={strokeWidth} 
            fill={fill}
            stroke={stroke}
        />
  )
}

export default Path