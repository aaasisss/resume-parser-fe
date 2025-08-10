import { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  Form,
  Upload,
  Button,
  Space,
  Alert,
} from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ParsedResponseCard from "../components/ParsedResponseCard";
import axios from "axios";
import SelectMode from "../components/SelectMode";
import { fileToBase64 } from "../utils/file";

const { Title } = Typography;

function ParseResumeScreen() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mode, setMode] = useState("local");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const screens = Grid.useBreakpoint();

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList.slice(-1));
  };

  const parseResume = async () => {
    if (!fileList.length) {
      setError("Please select a file.");
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    const file = fileList[0].originFileObj;
    if (!file) {
      setError("No file selected.");
      setLoading(false);
      return;
    }
    const base64File = await fileToBase64(file);

    const url = "https://api.resume.aaasisss.net/parse-resume";
    try {
      const res = await axios.post(
        url,
        {
          mode,
          resume_pdf_base64: base64File,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      let parsedResume;
      try {
        parsedResume = data.result;
        setProgress("Complete");
      } catch (err) {
        console.error("Failed to parse resume JSON:", err);
        setError(
          "Failed to parse resume data. Please check the backend response format."
        );
        setResponse(null);
        setLoading(false);
        return;
      }
      setResponse(parsedResume);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card
        style={{
          maxWidth: 480,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          borderRadius: 16,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
          Resume Parser
        </Title>
        <Form layout="vertical" onFinish={parseResume}>
          <Form.Item
            label="Upload PDF"
            required
            rules={[{ required: true, message: "Please upload a PDF file" }]}
          >
            <Upload
              accept="application/pdf"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              maxCount={1}
              style={{ width: "100%" }}
            >
              <Button icon={<UploadOutlined />} block>
                Select PDF
              </Button>
            </Upload>
          </Form.Item>
          <SelectMode mode={mode} setMode={setMode} />
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{ minWidth: 160 }}
                block={screens.xs}
              >
                Parse Resume
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
        {progress && !response && (
          <Alert
            message="Progress"
            description={progress}
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
      {response && <ParsedResponseCard response={response} />}
    </div>
  );
}

export default ParseResumeScreen;
