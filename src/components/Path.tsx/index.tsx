// Type
import { PathType } from "../../types/path-type"


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