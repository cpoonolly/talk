import { RouteProps } from "found";
import { graphql } from "react-relay";
import ModerationQueueContainer from "./ModerationQueueContainer";

export default class ReportedQueueContainer extends ModerationQueueContainer {
  public static routeConfig = ReportedQueueContainer.createRouteConfig();

  protected getEmptyQueueMessage(): string {
    return "Nicely done! There are no more reported comments to moderate.";
  }

  protected static createRouteConfig(): RouteProps {
    const queueQuery = graphql`
      query QueueContainerReportedQuery {
        moderationQueues {
          reported {
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
      query QueueContainerPaginationReportedQuery($count: Int!, $cursor: Cursor) {
        moderationQueues {
          reported {
            ...QueueContainer_queue @arguments(count: $count, cursor: $cursor)
          }
        }
      }
    `;

    const paginatedQueueContainer = ModerationQueueContainer.enhanceWithPagination(
      ReportedQueueContainer,
      paginationQuery
    );

    return ModerationQueueContainer.createRouteConfig(paginatedQueueContainer, queueQuery);
  }
}