import { useState } from "react";
import {
  Typography,
  Select,
  Grid,
  Card,
  Form,
  Upload,
  Button,
  Space,
  Alert,
  Input,
} from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ParsedResponseCard from "../components/ParsedResponseCard";
import { fileToBase64 } from "../utils/file";
import SelectMode from "../components/SelectMode";

const { Title, Text } = Typography;

function MatchJobScreen() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [mode, setMode] = useState("local");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [jobDescription, setJobDescription] = useState("");
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

    const ws = new WebSocket("ws://localhost:8000/ws/match-job");

    try {
      const base64File = await fileToBase64(file);
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            mode: mode,
            resume_pdf_base64: base64File,
            job_description: jobDescription,
          })
        );
      };
      ws.onmessage = (event) => {
        const msg = event.data;

        try {
          const parsed = JSON.parse(msg);
          console.log("Parsed message:", parsed);

          if (parsed.status === "done") {
            setResponse(parsed.result);
            setError(null);
            setLoading(false);
          } else if (parsed.status === "pending") {
            setProgress(parsed.result);
            setLoading(true);
          } else if (parsed.status === "error") {
            setError(parsed.result);
            setLoading(false);
          }
        } catch (err) {
          setError("An unknown error occurred.");
          setLoading(false);
        }
      };

      ws.onerror = (err) => {
        setError("WebSocket error: " + JSON.stringify(err));
        setLoading(false);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    } catch (error) {
      setError("An unknown error occurred.");
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={4}>Parse resume and match with job description</Title>
      <Text>
        Parse your resume and match with the provided job description. See what
        skills and experiences align with the job requirements.
      </Text>
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
          <Form.Item
            label="Job Description"
            required
            rules={[
              { required: true, message: "Please paste a job description" },
            ]}
          >
            <Input.TextArea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste the job description here"
              style={{ width: "100%" }}
            />
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
        {progress && (
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

export default MatchJobScreen;
