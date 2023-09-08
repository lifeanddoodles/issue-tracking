import { ICommentPopulatedDocument } from "../../../../shared/interfaces";
import { getInitials } from "../../../src/utils";

interface ICommentProps {
  comment: ICommentPopulatedDocument;
}

const Comment = ({ comment }: ICommentProps) => {
  const commentId =
    typeof comment._id === "string" ? comment._id : comment._id.toString();
  const { author } = comment;

  const handleUpdateComment = (commentId: string) => {
    console.log(`Update Comment ${commentId}`);
  };

  const handleDeleteComment = (commentId: string) => {
    console.log(`Delete Comment ${commentId}`);
  };

  return (
    <li id={commentId}>
      <div>
        {author.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={`Profile image of ${author?.firstName} ${author?.lastName}`}
          />
        ) : (
          <span>{getInitials(author.firstName, author.lastName)}</span>
        )}
      </div>
      <div>
        <header>
          <p>{`${author?.firstName} ${author?.lastName}`}</p>
        </header>
        <p>{comment.message}</p>
        <footer>
          <button onClick={() => handleUpdateComment(commentId)}>Edit</button>
          <button onClick={() => handleDeleteComment(commentId)}>Delete</button>
        </footer>
      </div>
    </li>
  );
};

export default Comment;
