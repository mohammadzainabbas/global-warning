// component
import SvgColor from '../../../components/svg-color';
import { HOME } from '../../../common/constants';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'home',
    path: HOME,
    icon: icon('ic_analytics'),
  },
  {
    title: 'View on Github',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
