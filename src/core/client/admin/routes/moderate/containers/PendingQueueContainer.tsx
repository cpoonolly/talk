import { RouteProps } from "found";
import { graphql } from "react-relay";
import ModerationQueueContainer from "./ModerationQueueContainer";

export default class PendingQueueContainer extends ModerationQueueContainer {
  public static routeConfig = PendingQueueContainer.createRouteConfig();

  protected getEmptyQueueMessage(): string {
    return "Nicely done! There are no more pending comments to moderate.";
  }

  protected static createRouteConfig(): RouteProps {
    const queueQuery = graphql`
      query QueueContainerPendingQuery {
        moderationQueues {
          pending {
            ...QueueContainer_queue
          }
        }
        settings {
          ...QueueContainer_settings
        }
      }
    `;

    const paginationQuery = graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query QueueContainerPaginationPendingQuery($count: Int!, $cursor: Cursor) {
        moderationQueues {
          pending {
            ...QueueContainer_queue @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `;

    const paginatedQueueContainer = ModerationQueueContainer.enhanceWithPagination(
      PendingQueueContainer,
      paginationQuery
    );

    return ModerationQueueContainer.createRouteConfig(paginatedQueueContainer, queueQuery);
  }
}