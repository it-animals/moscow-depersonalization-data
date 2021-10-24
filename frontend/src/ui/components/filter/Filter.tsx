import styled from "styled-components";
import { Typography } from "@mui/material";

const FilterItem = styled(Typography)`
  cursor: pointer;
`;

export const Filter: CT<{
  title: string;
  isActive: boolean;
  onClick?: (status: 1 | 2 | 3 | 4 | 0) => void;
  status: 1 | 2 | 3 | 4 | 0;
}> = ({ isActive, status, onClick, title }) => {
  return (
    <FilterItem
      onClick={() => {
        onClick && onClick(status);
      }}
      color={isActive ? "secondary.main" : "primary.main"}
    >
      {title}
    </FilterItem>
  );
};
