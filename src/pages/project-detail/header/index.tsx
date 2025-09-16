import { Typography, Avatar, AvatarGroup, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { ProjectUpdate } from "../../../apis/projects";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import AddmemberModal from "../../create-project/add-member";

interface Member {
  userId?: number;
  name?: string;
  userName?: string;
  avatar?: string;
}

interface BoardHeaderProps {
  project: ProjectUpdate | null;
  onProjectUpdate?: () => void;
}

export default function BoardHeader({ project, onProjectUpdate }: BoardHeaderProps) {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const handleAddMemberClick = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddMemberModalOpen(false);
    // Refresh project data when modal is closed
    if (onProjectUpdate) {
      onProjectUpdate();
    }
  };

  return (
    <div>
      <div className="board-header flex justify-start items-center gap-2 pb-5">
        <Typography
          sx={{ fontSize: "1.5rem", fontWeight: "bold", width: "40%" }}
        >
          Project name: {project?.projectName || "Board"}
        </Typography>
        <div className="members flex items-center gap-2">
          <Typography sx={{ fontSize: "1.2rem", fontWeight: "normal" }}>
            Members :
          </Typography>
          {project?.members && project.members.length > 0 ? (
            <AvatarGroup
              max={5}
              sx={{
                "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 12 },
              }}
            >
              {project.members.map((member: Member, index: number) => (
                <Tooltip
                  key={index}
                  title={member.name || member.userName}
                  arrow
                >
                  <Avatar
                    alt={member.name || member.userName}
                    src={member.avatar}
                    sx={{ width: 32, height: 32, fontSize: 12 }}
                  >
                    {(member.name || member.userName || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          ) : (
            <Typography sx={{ fontSize: "1rem", color: "text.secondary" }}>
              Chưa có thành viên
            </Typography>
          )}
<<<<<<< HEAD
          <Avatar sx={{ cursor: "pointer" }}>
=======
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              cursor: "pointer",
            }}
            onClick={handleAddMemberClick}
          >
>>>>>>> da7fa4ae80a3afeeb6e9e72046058cad69a8ada4
            <AddIcon />
          </Avatar>
        </div>
      </div>
      
      <AddmemberModal
        open={isAddMemberModalOpen}
        onClose={handleCloseModal}
        projectId={project?.id || 0}
      />
    </div>
  );
}
