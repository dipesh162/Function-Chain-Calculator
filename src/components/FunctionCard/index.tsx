import { ChevronDown, Euro } from 'lucide-react'

type Function = {
    id: number
    equation: string
    nextFunction: number | null
    input: number
    output: number
}

interface FunctionCardProps {
    func: Function
    onEquationChange: (id: number, equation: string) => void
}
  

const FunctionCard: React.FC<FunctionCardProps> = ({ func, onEquationChange }) => {
    return (
        <div className="bg-white border border-[#DFDFDF] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.05)] rounded-[15px] py-4 px-[20px] relative z-10">
            <div className="flex gap-[7px] items-center mb-[20px] font-semibold text-[14px] text-[#A5A5A5]">
                <img src="/images/dots.png" alt="Group" className='mt-1'/> Function: {func.id}
            </div>
            <div className="mb-4">
                <label htmlFor={`equation-${func.id}`} className="block text-[12px] font-medium text-left text-[#252525] mb-1">
                    Equation
                </label>
                <input
                    type="text"
                    id={`equation-${func.id}`}
                    value={func.equation}
                    onChange={(e) => onEquationChange(func.id, e.target.value)}
                    className="w-full py-2 px-[11px] border border-[#D3D3D3] rounded-lg text-[12px] font-medium text-[#252525]"
                    placeholder="Enter equation (e.g., x + 1)"
                />
            </div>
            <div className="mb-4">
                <label htmlFor={`next-function-${func.id}`} className="block text-[12px] font-medium text-left text-gray-700 mb-1">
                    Next function
                </label>
                <div className="relative">
                    <select
                        id={`next-function-${func.id}`}
                        disabled
                        className="appearance-none w-full bg-[#f5f5f5] border border-[#D3D3D3] text-[#b7b7b7] py-2 px-3 pr-8 rounded-lg font-medium leading-tight focus:outline-none text-[12px]"
                    >
                        <option>{func.nextFunction ? `Function: ${func.nextFunction}` : '-'}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        {/* <ChevronDown className="h-4 w-4" /> */}
                        <img src="/images/chevron-down.png" className="h-4 w-4" alt="down-arrow" />
                    </div>
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-[45px]">
                <div className="flex gap-1 items-center text-[10px] text-[#585757] font-medium">
                    <div className="flex items-center justify-center border-[2px] border-[#DBDBDB] w-4 h-4 rounded-[50%]">
                        <div className="w-2 h-2 bg-[#93C5FD] rounded-[50%]"></div>
                    </div>
                    <div>input</div>
                </div>
                <div className="flex gap-1 items-center text-[10px] text-[#585757] font-medium">
                    <div>output</div>
                    <div className="flex items-center justify-center border-[2px] border-[#DBDBDB] w-4 h-4 rounded-[50%]">
                        <div className="w-2 h-2 bg-[#93C5FD] rounded-[50%] self-center"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FunctionCard