import { forwardRef, useImperativeHandle, useRef } from "react"
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

interface InputOutputRef {
    getWidth: () => number; // Your custom method
}

const InputOutput = forwardRef<InputOutputRef, InputOutputProps>(
    ({ labelText, labelBgColor, inputValue, inputOnChange, dividerColor, inputOrder, inputBorderColor }, ref) => {

    // const inputOutputRef = useRef<{ getWidth: () => number}>(null);

    // // Expose the width of the component to the parent
    // useImperativeHandle(ref, () => ({
    //     getWidth: () => {
    //       return inputOutputRef.current ? inputOutputRef.current.offsetWidth : 0; // Return the width
    //     },
    // }));

    return (
        <div className="w-[111px]" 
            // ref={inputOutputRef}
        >
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
})

export default InputOutput