import ArrowBack from './arrow-back.svg';
import Business from './business.svg';
import BusinessOutline from './business-outline.svg';
import CalendarOutline from './calendar-outline.svg';
import ChatbubbleEllipsesOutline from './chatbubble-ellipses-outline.svg';
import CheckmarkCircle from './checkmark-circle.svg';
import ChevronBack from './chevron-back.svg';
import DocumentTextOutline from './document-text-outline.svg';
import EllipseOutline from './ellipse-outline.svg';
import GlobeOutline from './globe-outline.svg';
import HelpCircle from './help-circle.svg';
import HelpCircleOutline from './help-circle-outline.svg';
import Home from './home.svg';
import HomeOutline from './home-outline.svg';
import LocationOutline from './location-outline.svg';
import LockClosedOutline from './lock-closed-outline.svg';
import LogOutOutline from './log-out-outline.svg';
import MailOpenOutline from './mail-open-outline.svg';
import Menu from './menu.svg';
import Notifications from './notifications.svg';
import NotificationsOutline from './notifications-outline.svg';
import Person from './person.svg';
import PersonOutline from './person-outline.svg';
import TimeOutline from './time-outline.svg';
import TrashOutline from './trash-outline.svg';
import WarningOutline from './warning-outline.svg';

export const iconMap = {
  'arrow-back': ArrowBack,
  business: Business,
  'business-outline': BusinessOutline,
  'calendar-outline': CalendarOutline,
  'chatbubble-ellipses-outline': ChatbubbleEllipsesOutline,
  'checkmark-circle': CheckmarkCircle,
  'chevron-back': ChevronBack,
  'document-text-outline': DocumentTextOutline,
  'ellipse-outline': EllipseOutline,
  'globe-outline': GlobeOutline,
  'help-circle': HelpCircle,
  'help-circle-outline': HelpCircleOutline,
  home: Home,
  'home-outline': HomeOutline,
  'location-outline': LocationOutline,
  'lock-closed-outline': LockClosedOutline,
  'log-out-outline': LogOutOutline,
  'mail-open-outline': MailOpenOutline,
  menu: Menu,
  notifications: Notifications,
  'notifications-outline': NotificationsOutline,
  person: Person,
  'person-outline': PersonOutline,
  'time-outline': TimeOutline,
  'trash-outline': TrashOutline,
  'warning-outline': WarningOutline,
} as const;

export type IconName = keyof typeof iconMap;
