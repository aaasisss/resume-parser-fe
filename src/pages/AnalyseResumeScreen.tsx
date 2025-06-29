import {
  Card,
  Form,
  Upload,
  Button,
  Space,
  Alert,
  Grid,
  Typography,
} from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ParsedResponseCard from "../components/ParsedResponseCard";
import { fileToBase64 } from "../utils/file";
import { useState } from "react";
import SelectMode from "../components/SelectMode";

const { Title } = Typography;

function AnalyseResumeScreen() {
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

  const analyseResume = async () => {
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

    const ws = new WebSocket("ws://localhost:8000/ws/analyze-visual");

    try {
      const base64File = await fileToBase64(file);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            resume_pdf_base64: base64File,
            mode: mode,
          })
        );
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data || "{}");

        if (data.status === "done") {
          setResponse(data.result);
          setError(null);
          setLoading(false);
        } else if (data.status === "pending") {
          setProgress(data.result);
          setLoading(true);
        } else if (data.status === "error") {
          setError(data.result);
          setLoading(false);
        }
        setLoading(false);
      };
    } catch (error) {
      setError("An unknown error occurred.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Analyse Resume</Title>
      <div style={{ height: "100%", width: "100%" }}>
        <Card
          style={{
            width: "100%",
            maxWidth: 480,
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            borderRadius: 16,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "auto",
          }}
        >
          <Title level={2} style={{ textAlign: "center", marginBottom: 32 }}>
            Resume Parser
          </Title>
          <Form layout="vertical" onFinish={analyseResume}>
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
                  Analyse Resume
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
    </div>
  );
}

export default AnalyseResumeScreen;
