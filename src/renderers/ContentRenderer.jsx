import NotesRenderer from "../../renderers/NotesRenderer";

import ComingSoon from "./ComingSoon";
import Image from "./Image";
import Table from "./Table";
import Summary from "./Summary";
import Formula from "./Formula";
import Diagram from "./Diagram";
import Example from "./Example";
import Practice from "./Practice";
import KeyPoints from "./KeyPoints";

export default function ContentRenderer({
  content,
  activeTab,
}) {
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
        <Summary summary={content.summary} />
      )}

      {content.formulas && (
        <Formula formulas={content.formulas} />
      )}

      {content.diagrams && (
        <Diagram diagrams={content.diagrams} />
      )}

      {content.examples && (
        <Example examples={content.examples} />
      )}

      {content.practice && (
        <Practice practice={content.practice} />
      )}

      {content.keyPoints && (
        <KeyPoints keyPoints={content.keyPoints} />
      )}
    </>
  );
}
