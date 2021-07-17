import { Button, PageHeader } from "antd";
import { Link, useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();

  function handleBack() {
    history.push("/");
  }

  return (
    <PageHeader
      style={style}
      onBack={handleBack}
      title="BLOGLOG"
      extra={[
        <Link
          to={{
            pathname: "https://github.com/apps/bloglog-bot/installations/new",
          }}
          target="_blank"
        >
          <Button>Install</Button>
        </Link>,
      ]}
    />
  );
}

const style: React.CSSProperties = {
  border: "1px solid rgb(235, 237, 240)",
  background: "white",
};

export default Header;
