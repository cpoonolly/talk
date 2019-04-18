import { RouteProps } from "found";
import { graphql } from "react-relay";
import ModerationQueueContainer from "./ModerationQueueContainer";

export default class UnmoderatedQueueContainer extends ModerationQueueContainer {
  public static routeConfig = UnmoderatedQueueContainer.getRouteConfig();

  protected getEmptyQueueMessage(): string {
    return "Nicely done! All comments have been moderated.";
  }

  protected static getRouteConfig(): RouteProps {
    const queueQuery = graphql`
      query QueueContainerUnmoderatedQuery {
        moderationQueues {
          unmoderated {
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
      query QueueContainerPaginationUnmoderatedQuery(
        $count: Int!
        $cursor: Cursor
      ) {
        moderationQueues {
          unmoderated {
            ...QueueContainer_queue @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `;

    const paginatedQueueContainer = ModerationQueueContainer.enhanceWithPagination(
      UnmoderatedQueueContainer,
      paginationQuery
    );

    return ModerationQueueContainer.createRouteConfig(paginatedQueueContainer, queueQuery);
  }
}