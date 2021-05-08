import type { CommentCSMsg, CommentDetail } from "@cloudmusic/shared";
import React, { useState } from "react";
import { request, vscode } from "../utils";
import { FiThumbsUp } from "react-icons/fi";
import dayjs from "dayjs";
import i18n from "../i18n";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type CommentProps = CommentDetail;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Comment = ({
  user,
  content,
  commentId,
  time,
  likedCount,
  liked,
  replyCount,
  beReplied,
}: CommentProps): JSX.Element => {
  const [l, setL] = useState(liked);
  return (
    <div className="box-border w-full my-4 rounded-xl bg-black bg-opacity-20 shadow-md flex flex-row p-4 overflow-hidden">
      <img
        className="cursor-pointer rounded-full h-16 w-16"
        src={user.avatarUrl}
        alt={user.nickname}
        onClick={() => vscode.postMessage({ command: "user", id: user.userId })}
      />
      <div className="flex-1 ml-4 text-base">
        <div>
          <div
            className="cursor-pointer inline-block text-blue-600 text-lg"
            onClick={() =>
              vscode.postMessage({ command: "user", id: user.userId })
            }
          >
            {user.nickname}
          </div>
          <div className="inline-block ml-4 text-sm">
            {dayjs(time).fromNow()}
          </div>
        </div>
        <div className="mt-1">{content}</div>
        {beReplied && (
          <div className="text-base mt-1 ml-2 border-solid border-l-4 border-blue-600">
            <div
              className="cursor-pointer inline-block text-blue-600"
              onClick={() =>
                vscode.postMessage({
                  command: "user",
                  id: beReplied.user.userId,
                })
              }
            >
              @{beReplied.user.nickname}
            </div>
            : {beReplied.content}
          </div>
        )}
        <div className="mt-1">
          <div className="inline-block">
            <div
              className="cursor-pointer inline-block"
              onClick={async () => {
                if (
                  await request<boolean, CommentCSMsg>({
                    command: "like",
                    id: commentId,
                    t: l ? "unlike" : "like",
                  })
                ) {
                  setL(!l);
                }
              }}
            >
              <FiThumbsUp size={13} color={l ? "#2563EB" : undefined} />
            </div>
            <div className="inline-block ml-2">{likedCount}</div>
          </div>
          <div
            className="cursor-pointer inline-block ml-6"
            // onClick={() => vscode.postMessage({ command: "reply", id: commentId })}
          >
            {i18n.word.reply}
          </div>
          {replyCount > 0 && (
            <div
              className="cursor-pointer inline-block text-blue-600 ml-6"
              // onClick={() => vscode.postMessage({ command: "floor", id: commentId })}
            >
              {replyCount} {i18n.word.reply}
              {" >"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
