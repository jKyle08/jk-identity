export abstract class BaseEntity<TProps> {
  protected constructor(protected readonly props: TProps) {}

  toProps(): TProps {
    return { ...this.props };
  }
}
