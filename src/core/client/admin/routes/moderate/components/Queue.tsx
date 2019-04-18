import React, { StatelessComponent } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import AutoLoadMoreContainer from "talk-admin/containers/AutoLoadMoreContainer";
import { Flex, HorizontalGutter, Card } from "talk-ui/components";
import { PropTypesOf } from "talk-ui/types";

import ModerateCardContainer from "../containers/ModerateCardContainer";

import styles from "./Queue.css";

export type QueueComments = Array<{ id: string } & PropTypesOf<typeof ModerateCardContainer>["comment"]>;
export type QueueSettings = PropTypesOf<typeof ModerateCardContainer>["settings"];

interface Props {
  comments: QueueComments;
  settings: QueueSettings;
  onLoadMore: () => void;
  hasMore: boolean;
  disableLoadMore: boolean;
  danglingLogic: PropTypesOf<typeof ModerateCardContainer>["danglingLogic"];
  emptyMessage?: string;
}

const Queue: StatelessComponent<Props> = ({
  settings,
  comments,
  hasMore,
  disableLoadMore,
  onLoadMore,
  danglingLogic,
  emptyMessage,
}) => (
    <HorizontalGutter className={styles.root} size="double">
      <TransitionGroup component={null} appear={false} enter={false} exit>
        {comments.map(c => (
          <CSSTransition
            key={c.id}
            timeout={400}
            classNames={{
              exit: styles.exitTransition,
              exitActive: styles.exitTransitionActive,
              exitDone: styles.exitTransitionDone,
            }}
          >
            <ModerateCardContainer
              settings={settings}
              comment={c}
              danglingLogic={danglingLogic}
            />
          </CSSTransition>
        ))}
        {comments.length === 0 && emptyMessage !== undefined && (
          <Card>
            <span>{emptyMessage}</span>
          </Card>
        )}
      </TransitionGroup>
      {hasMore && (
        <Flex justifyContent="center">
          <AutoLoadMoreContainer
            disableLoadMore={disableLoadMore}
            onLoadMore={onLoadMore}
          />
        </Flex>
      )}
    </HorizontalGutter>
  );

export default Queue;
