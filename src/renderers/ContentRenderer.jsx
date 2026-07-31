import NotesRenderer from "./NotesRenderer";
import SummaryRenderer from "./SummaryRenderer";
import FormulaRenderer from "./FormulaRenderer";
import DiagramRenderer from "./DiagramRenderer";
import ExamplesRenderer from "./ExamplesRenderer";
import PracticeRenderer from "./PracticeRenderer";
import KeyPointsRenderer from "./KeyPointsRenderer";
import Image from "../components/contents/Image";
import Table from "../components/contents/Table";

export default function ContentRenderer({ content }) {
  return (
    <>
      {content.notes && (
        <NotesRenderer notes={content.notes} />
      )}

      {content.images && (
        <Image images={content.images} />
      )}

      {content.tables && (
        <Table tables={content.tables} />
      )}

      {content.summary && (
        <SummaryRenderer summary={content.summary} />
      )}

      {content.formulas && (
        <FormulaRenderer formulas={content.formulas} />
      )}

      {content.diagrams && (
        <DiagramRenderer diagrams={content.diagrams} />
      )}

      {content.examples && (
        <ExamplesRenderer examples={content.examples} />
      )}

      {content.practice && (
        <PracticeRenderer practice={content.practice} />
      )}

      {content.keyPoints && (
        <KeyPointsRenderer keyPoints={content.keyPoints} />
      )}
    </>
  );
}
