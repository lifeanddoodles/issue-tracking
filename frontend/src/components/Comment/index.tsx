import { useState } from "react";
import {
  IComment,
  ICommentPopulatedDocument,
} from "../../../../shared/interfaces";
import { getInitials } from "../../../src/utils";
import useFetch from "../../hooks/useFetch";
import {
  COMMENTS_BASE_API_URL,
  getDeleteCommentOptions,
  getUpdateCommentOptions,
} from "../../routes";
import Button from "../Button";
import Input from "../Input";

interface ICommentProps {
  comment: ICommentPopulatedDocument;
}

const Comment = ({ comment }: ICommentProps) => {
  const [isEdited, setIsEdited] = useState(comment.isEdited);
  const [message, setMessage] = useState(comment.message);
  const [toggleEdit, setToggleEdit] = useState(false);
  const commentId =
    typeof comment._id === "string" ? comment._id : comment._id.toString();
  const { author } = comment;
  const { data, loading, error, sendRequest } = useFetch<IComment>();

  const commentRequest = (commentId: string, options?: RequestInit) => {
    sendRequest({
      url: `${COMMENTS_BASE_API_URL}/${commentId}`,
      options,
    });
    if (error) {
      console.log(error);
    }
  };

  const handleUpdateComment = (commentId: string) => {
    setToggleEdit((prev) => !prev);
    if (toggleEdit) {
      const options = getUpdateCommentOptions(message);
      commentRequest(commentId, options);
      data && setIsEdited(data?.isEdited);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Delete Comment ${commentId}`);
    const options = getDeleteCommentOptions();
    commentRequest(commentId, options);
  };

  return (
    <li id={commentId} className="comment comment__container">
      <div className="comment__avatar">
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={`Profile image of ${author?.firstName} ${author?.lastName}`}
            className="comment__avatar--image"
          />
        ) : (
          <span className="comment__avatar--initials">
            {getInitials(author.firstName, author.lastName)}
          </span>
        )}
      </div>
      <div>
        <header className="comment__header">
          <span>{`${author?.firstName} ${author?.lastName}`}</span>
          {comment?.createdAt && (
            <span>
              {typeof comment.createdAt === "string"
                ? new Date(comment.createdAt).toLocaleString()
                : comment.createdAt.toLocaleDateString()}
            </span>
          )}
          {isEdited && <span>Edited</span>}
        </header>
        <div className="comment__message">
          {!loading && !toggleEdit && <p>{message}</p>}
          {toggleEdit && (
            <Input
              id="comment__message--input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
        </div>
        <footer className="comment__footer comment__footer--actions">
          <Button label="Edit" onClick={() => handleUpdateComment(commentId)} />
          <Button
            label="Delete"
            onClick={() => handleDeleteComment(commentId)}
          />
        </footer>
      </div>
    </li>
  );
};

export default Comment;
