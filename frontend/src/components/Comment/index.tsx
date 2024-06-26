import { useState } from "react";
import {
  IComment,
  ICommentPopulatedDocument,
} from "../../../../shared/interfaces";
import useFetch from "../../hooks/useFetch";
import {
  COMMENTS_BASE_API_URL,
  getDeleteOptions,
  getUpdateCommentOptions,
} from "../../routes";
import Avatar from "../Avatar";
import Button from "../Button";
import Input from "../Input";
import Text from "../Text";
import CommentHeader from "./CommentHeader";

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
    const options = getDeleteOptions();
    commentRequest(commentId, options);
  };

  return (
    <li id={commentId} className="comment comment__container flex gap-4 mb-6">
      <Avatar
        firstName={author?.firstName}
        lastName={author?.lastName}
        imageUrl={author?.avatarUrl}
        className="comment__avatar"
      />
      <div>
        <CommentHeader
          firstName={author?.firstName}
          lastName={author?.lastName}
          createdAt={
            comment.lastModifiedAt &&
            comment.createdAt !== comment.lastModifiedAt
              ? comment.lastModifiedAt
              : comment.createdAt
          }
          isEdited={isEdited}
        />
        <div className="comment__message mb-2">
          {!loading && !toggleEdit && <Text>{message}</Text>}
          {toggleEdit && (
            <Input
              id="comment__message--input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
        </div>
        <footer className="comment__footer comment__footer--actions flex gap-4">
          <Button onClick={() => handleUpdateComment(commentId)} variant="link">
            Edit
          </Button>
          <Button onClick={() => handleDeleteComment(commentId)} variant="link">
            Delete
          </Button>
        </footer>
      </div>
    </li>
  );
};

export default Comment;
