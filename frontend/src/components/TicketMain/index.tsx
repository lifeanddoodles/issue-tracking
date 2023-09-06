import { ObjectId } from "mongoose";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuthorInfo } from "../../../../frontend/src/utils";
import { IComment, ITicket, IUser } from "../../../../shared/interfaces";
import Comment from "../Comment";

interface ITicketMainProps {
  ticket: ITicket & { _id: string };
  comments: (IComment & { _id: string })[];
}

const TicketMain = ({ ticket, comments }: ITicketMainProps) => {
  const [loading, setLoading] = useState(false);
  const [formattedComments, setFormattedComments] = useState<
    | {
        comment: IComment & {
          _id: string | ObjectId | Record<string, unknown>;
        };
        author: IUser & { _id: string | ObjectId | Record<string, unknown> };
      }[]
    | []
  >([]);

  const noComments = useMemo(
    () => formattedComments?.length === 0,
    [formattedComments]
  );

  const handleAddComment = () => {
    console.log("Add Comment");
  };

  async function formatComment(
    comment: IComment & {
      _id: string | ObjectId | Record<string, unknown>;
    }
  ) {
    const authorRes = await getAuthorInfo(comment.author);

    return {
      comment,
      author: authorRes,
    };
  }

  const getFormattedComments = useCallback(
    async (
      comments: (IComment & {
        _id: string | ObjectId | Record<string, unknown>;
      })[]
    ) => {
      if (!comments || comments?.length === 0) return [];
      setLoading(true);

      const newComments = await Promise.all(
        comments.map(async (comment) => {
          const newComment = await formatComment(comment);
          return newComment;
        })
      );
      return newComments;
    },
    []
  );

  const loadFormattedComments = useCallback(async () => {
    if (!comments || comments.length === 0) return;
    const newComments = await getFormattedComments(comments);

    setFormattedComments(newComments);
    setLoading(false);
  }, [comments, getFormattedComments]);

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
                  author={item.author}
                />
              ))}
          </ul>
        )}
        <div>
          <button onClick={handleAddComment}>Add comment</button>
        </div>
      </aside>
    </>
  );
};

export default TicketMain;
