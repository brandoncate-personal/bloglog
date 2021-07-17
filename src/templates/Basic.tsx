import { Layout } from "antd";
import Header from "../components/Header";
import { StyleMap } from "../types/style";

const { Content, Footer } = Layout;

interface IProps {
  children: JSX.Element;
}

function Basic(props: IProps) {
  return (
    <Layout style={styles.Layout}>
      <Header />
      <Content style={styles.Content}>
        <div style={styles.ContentContainer}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

const styles: StyleMap = {
  Layout: {
    minHeight: "100vh",
  },
  Content: {
    padding: "3rem",
  },
  ContentContainer: {
    minHeight: "10rem",
    padding: "3rem",
    background: "white",
  },
};

export default Basic;
