import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ICommentPopulatedDocument,
  ITicketPopulatedDocument,
} from "../../../../shared/interfaces";
import Comment from "../Comment";

interface ITicketMainProps {
  ticket: ITicketPopulatedDocument;
  comments: ICommentPopulatedDocument[];
}

const TicketMain = ({ ticket, comments }: ITicketMainProps) => {
  const [loading, setLoading] = useState(false);
  const [displayCommentEditor, setDisplayCommentEditor] = useState(false);
  const [formattedComments, setFormattedComments] = useState<
    | {
        comment: ICommentPopulatedDocument;
      }[]
    | []
  >([]);

  const noComments = useMemo(
    () => formattedComments?.length === 0,
    [formattedComments]
  );

  const handleAddComment = () => {
    console.log("Add Comment");
    setDisplayCommentEditor(false);
  };

  const handleCancelComment = () => {
    console.log("Cancel Comment");
    setDisplayCommentEditor(false);
  };

  const loadFormattedComments = useCallback(async () => {
    if (!comments || comments.length === 0) return;
    const newComments = comments.map((comment) => ({
      comment,
    }));

    setFormattedComments(newComments);
    setLoading(false);
  }, [comments]);

  useEffect(() => {
    loadFormattedComments();
  }, [loadFormattedComments]);

  return (
    <>
      <main>
        <h1>{ticket.title}</h1>
        <h2>Description</h2>
        <p>{ticket.description}</p>
        {/* TODO: Add attachments
        {<h2>Attachments</h2>} */}
        {/* TODO: Populate subtasks
        {<h2>Subtasks</h2>} */}
      </main>
      <aside>
        <h2>Comments</h2>
        <input
          placeholder="Add a comment..."
          onFocus={() => setDisplayCommentEditor(true)}
        ></input>
        {displayCommentEditor && (
          <>
            <button onClick={handleAddComment}>Add comment</button>
            <button onClick={handleCancelComment}>Cancel</button>
          </>
        )}
        {noComments ? (
          <p>No comments yet</p>
        ) : (
          <ul>
            {!loading &&
              formattedComments.map((item) => (
                <Comment
                  key={
                    typeof item.comment._id === "string"
                      ? item.comment._id
                      : item.comment._id.toString()
                  }
                  comment={item.comment}
                />
              ))}
          </ul>
        )}
      </aside>
    </>
  );
};

export default TicketMain;
