// types.ts – Выносим типы
import { ChecklistSection } from '../../utils/parsedChecklist';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../App';

export type ChecklistScreenProps = NativeStackScreenProps<RootStackParamList, 'Чек-лист'>;

export type AnswerHandler = (
  sectionIdx: number,
  itemIdx: number,
  subIdx: number,
  answer: string
) => void;

export type CommentHandler = (
  sectionIdx: number,
  itemIdx: number,
  subIdx: number,
  text: string
) => void;
