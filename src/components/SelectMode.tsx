import { Form, Select } from "antd";

const { Option } = Select;

interface SelectModeProps {
  mode: string;
  setMode: (mode: string) => void;
  required?: boolean;
  label?: string;
}

const SelectMode = (props: SelectModeProps) => {
  const { mode, setMode, required, label = "Select Mode" } = props;

  return (
    <div>
      <Form.Item label={label} required={required}>
        <Select value={mode} onChange={setMode} style={{ width: "100%" }}>
          <Option value="openai">OpenAI (gpt-4o)</Option>
          <Option value="google">Google (gemini-1.5-pro)</Option>
          <Option value="local">Local LLM</Option>
        </Select>
      </Form.Item>
    </div>
  );
};

export default SelectMode;
