import { ObjectId } from "mongoose";
import { IComment, IUser } from "../../../../shared/interfaces";
import { getFullName } from "../../../../shared/utils";

interface ICommentProps {
  comment: IComment & { _id: string | ObjectId | Record<string, unknown> };
  author: IUser & { _id: string | ObjectId | Record<string, unknown> };
}

const Comment = ({ comment, author }: ICommentProps) => {
  return (
    <li
      id={
        typeof comment._id === "string" ? comment._id : comment._id.toString()
      }
    >
      <p>{comment.message}</p>
      <p>{getFullName(author.firstName, author.lastName)}</p>
    </li>
  );
};

export default Comment;
