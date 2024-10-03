import { FC } from "react"


interface props{
    labelText: string, 
    labelBgColor: string, 
}

const Label: FC<props> = ({labelText, labelBgColor}) =>{

  return (
    <div className={`font-semibold mb-1.5 h-[22px] text-white rounded-[14px] text-[12px] flex items-center justify-center`} style={{backgroundColor : labelBgColor}}>
        {labelText}
    </div>
  )
}

export default Label