import { useCallback, useEffect, useMemo, useState } from "react";
import { ICommentPopulatedDocument } from "../../../../shared/interfaces";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import Input from "../../components/Input";
import Comment from "../Comment";

interface ITicketCommentsProps {
  comments: ICommentPopulatedDocument[];
}

const TicketComments = ({ comments }: ITicketCommentsProps) => {
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
    setDisplayCommentEditor(false);
  };

  const handleCancelComment = () => {
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
    <aside className="w-full md:col-start-1 md:row-start-2 py-2 px-4">
      <Heading text="Comments" className="text-xl" />
      <Input
        id="comment__message--input"
        type="text"
        placeholder="Add a comment..."
        className={!displayCommentEditor ? "mb-8" : "mb-1"}
        onFocus={() => setDisplayCommentEditor(true)}
      />
      {displayCommentEditor && (
        <div role="group" className="flex gap-2 mb-8">
          <Button label="Add comment" onClick={handleAddComment} />
          <Button label="Cancel" onClick={handleCancelComment} />
        </div>
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
  );
};

export default TicketComments;
