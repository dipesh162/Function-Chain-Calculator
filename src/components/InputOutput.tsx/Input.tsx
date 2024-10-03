// React
import { FC } from "react"

// Components
import ConnectingVertex from "../ConnectingVertex"


interface props{
    inputValue: number, 
    inputOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputOrder?: string
    inputBorderColor: string
    dividerColor: string
}

const Input: FC<props> = ({inputValue, inputOnChange, dividerColor, inputOrder, inputBorderColor}) =>{
  const isReversed = inputOrder === 'reversed' ? {transform: 'scaleX(-1)'} : {}
  
  return (
    <div className={`bg-white flex rounded-[15px] border-[2px] relative z-[11] mb-[1px]`}
      style={{
        borderColor: inputBorderColor,
        ...isReversed
      }}
    >
        <input
            type="number"
            value={inputValue}
            onChange={inputOnChange}
            disabled={inputOrder === 'reversed'}
            className="focus:outline-none rounded-[inherit] z-[20] px-2 py-[9px]  text-center bg-white border-[#E5E7EB] w-[63.5%] text-lg font-semibold"
            style={{...isReversed}}
            
        />
        <div className={`border-l-[1px] flex flex-grow items-center justify-center`} style={{borderColor: dividerColor}}>
            <svg className="absolute -top-[27px] -left-[28px] w-[187px] mix-blend-multiply">
                  <path
                      d="M120 50 L220 50"
                      fill="#AECDFA"
                      stroke="#AECDFA"
                      strokeWidth="8"
                  />
            </svg>
            <ConnectingVertex/>
        </div>
    </div>
  )
}

export default Input