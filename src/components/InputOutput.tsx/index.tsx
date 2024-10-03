// Components
import Input from "./Input"
import Label from "./Label"

interface InputOutputProps {
  labelText: string;
  labelBgColor: string;
  inputValue: number;
  inputOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dividerColor: string;
  inputOrder?: string;
  inputBorderColor: string;
}


const InputOutput = ({labelText, labelBgColor, inputValue, inputOnChange, dividerColor, inputOrder, inputBorderColor }:InputOutputProps) => {

    return (
        <div className="w-[115px]">
            <Label
                labelText={labelText}
                labelBgColor={labelBgColor}
            />
            <Input
                inputValue={inputValue}
                inputOnChange={inputOnChange}
                dividerColor={dividerColor}
                inputOrder={inputOrder}
                inputBorderColor={inputBorderColor}
            />
        </div>
    )
}

export default InputOutput