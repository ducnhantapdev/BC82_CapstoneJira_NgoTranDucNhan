import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function CreateProjectModal() {
  const navigate = useNavigate();
  return (
    <div>
      <div>
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={() => navigate("/create-project")}
        >
          Create Project
        </Button>
      </div>
    </div>
  );
}
