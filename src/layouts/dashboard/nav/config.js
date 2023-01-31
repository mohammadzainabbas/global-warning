// component
import SvgColor from '../../../components/svg-color';
import { HOME, GITHUB_REPO_LINK, TASKS, MAP, EMISSIONS } from '../../../common/constants';
import HomeIcon from '@mui/icons-material/Home';
import GitHubIcon from '@mui/icons-material/GitHub';
import TaskIcon from '@mui/icons-material/Task';
import MapIcon from '@mui/icons-material/Map';
import FloodIcon from '@mui/icons-material/Flood';
import Co2Icon from '@mui/icons-material/Co2';
// ----------------------------------------------------------------------

// const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Home',
    path: HOME,
    icon: <HomeIcon />,
  },
  {
    title: 'Emissions',
    path: `${HOME}/${EMISSIONS}`,
    icon: <Co2Icon />,
  },
  {
    title: 'Map',
    path: `${HOME}/${MAP}`,
    icon: <MapIcon />,
  },
  {
    title: 'Tasks',
    path: `${HOME}/${TASKS}`,
    icon: <TaskIcon />,
  },
  {
    title: 'View on Github',
    path: GITHUB_REPO_LINK,
    icon: <GitHubIcon />,
  },
];

export default navConfig;
