import { Typography, Layout, Menu, theme, Switch, ConfigProvider } from "antd";
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
import { MoonFilled, SunFilled } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";

const { Title } = Typography;

function AppLayout({
  isDark,
  setIsDark,
}: {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
}) {
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
      <Sider breakpoint="lg" collapsedWidth="0" theme={isDark ? "dark" : "light"}>
        <Title style={{ color: isDark ? "#fff" : undefined, textAlign: "center" }}>
          Resume Parser
        </Title>
        <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, alignItems: "center" }}>
          <Switch
            checked={isDark}
            onChange={(checked) => setIsDark(checked)}
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<SunFilled />}
          />
          <span style={{ color: isDark ? "#fff" : undefined }}>Dark mode</span>
        </div>
        <Menu
          theme={isDark ? "dark" : "light"}
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
  const getInitialDark = () => {
    const stored = localStorage.getItem("theme-mode");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  }, [isDark]);

  const algorithm = useMemo(() => (isDark ? theme.darkAlgorithm : theme.defaultAlgorithm), [isDark]);

  return (
    <ConfigProvider theme={{ algorithm }}>
      <Router>
        <AppLayout isDark={isDark} setIsDark={setIsDark} />
      </Router>
    </ConfigProvider>
  );
}

export default App;
