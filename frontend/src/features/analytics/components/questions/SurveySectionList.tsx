import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import type { SurveySection } from "@/shared/types/survey";
import type { SurveyAnswers } from "../../utils/surveyUtils";
import SurveyQuestionRenderer from "./SurveyQuestionRenderer";

interface SurveySectionListProps {
  sections: SurveySection[];
  answers: SurveyAnswers;
  onAnswer: (questionId: string, value: string | number) => void;
  showDividers?: boolean;
  spacerClassName?: string;
  dividerClassName?: string;
}

function SurveySectionList({
  sections,
  answers,
  onAnswer,
  showDividers = false,
  spacerClassName,
  dividerClassName,
}: SurveySectionListProps) {
  const { t } = useTranslation();

  return (
    <>
      {sections.map((section) => (
        <Fragment key={section.id}>
          {section.title && <h3>{t(section.title, { defaultValue: section.title })}</h3>}
          {section.description && <p>{t(section.description, { defaultValue: section.description })}</p>}
          {section.questions.map((question) => (
            <SurveyQuestionRenderer
              key={question.id}
              question={question}
              answers={answers}
              onAnswer={onAnswer}
            />
          ))}
          {showDividers && spacerClassName && <div className={spacerClassName} />}
          {showDividers && dividerClassName && <hr className={dividerClassName} />}
          {showDividers && spacerClassName && <div className={spacerClassName} />}
        </Fragment>
      ))}
    </>
  );
}

export default SurveySectionList;
