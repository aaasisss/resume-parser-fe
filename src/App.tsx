import { Typography, Layout, Menu, theme } from "antd";
import type { MenuProps } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import {
  FileSearchOutlined,
  FileDoneOutlined,
  FileSyncOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import ParseResumeScreen from "./pages/ParseResumeScreen";
import MatchJobScreen from "./pages/MatchJobScreen";
import AnalyseResumeScreen from "./pages/AnalyseResumeScreen";

const { Title } = Typography;

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuKeyToRoute: Record<string, string> = {
    "1": "/",
    "2": "/match-job",
    "3": "/analyse-resume",
  };
  const routeToMenuKey: Record<string, string> = {
    "/": "1",
    "/match-job": "2",
    "/analyse-resume": "3",
  };

  const selectedKey = routeToMenuKey[location.pathname] || "1";

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items: MenuProps["items"] = [
    {
      key: "1",
      icon: <FileSearchOutlined />,
      label: "Parse Resume",
    },
    {
      key: "2",
      icon: <FileDoneOutlined />,
      label: "Match Job",
    },
    {
      key: "3",
      icon: <FileSyncOutlined />,
      label: "Analyse Resume",
    },
  ];

  return (
    <Layout
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
      }}
    >
      <Sider breakpoint="lg" collapsedWidth="0">
        <Title style={{ color: "white", textAlign: "center" }}>
          Resume Parser
        </Title>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            navigate(menuKeyToRoute[key as string]);
          }}
        />
      </Sider>
      <Layout>
        <Content>
          <div
            style={{
              height: "100%",
              width: "100%",
              overflow: "auto",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/" element={<ParseResumeScreen />} />
              <Route path="/match-job" element={<MatchJobScreen />} />
              <Route path="/analyse-resume" element={<AnalyseResumeScreen />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
