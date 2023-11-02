import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tab from './Tab'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Tab component', () => {
  const sampleHeaders = ['Tab1', 'Tab2', 'Tab3'];
  const sampleChildren = [<div key={1}>Content1</div>, <div key={2}>Content2</div>, <div key={3}>Content3</div>];

  it('should render tab headers correctly', () => {
    render(<Tab header={sampleHeaders}>{sampleChildren}</Tab>);
    sampleHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });
  });

  it('should activate the correct tab on click', () => {
    render(<Tab header={sampleHeaders}>{sampleChildren}</Tab>);

    fireEvent.click(screen.getByText('Tab2'));

    // Check if the second tab is now active
    // It could be visually active (e.g. by being bold, which you'd test using CSS classes/styles)
    // Or logically active (e.g. by rendering the correct child component)

    // Example checking for CSS style change:
    // expect(screen.getByText('Tab2')).toHaveClass('active');

    // Example checking for rendering the correct child:
    expect(screen.getByText('Content2')).toBeVisible();
  });

  it('should render the correct content on initial render based on activeIndex prop', () => {
    render(
      <Tab header={sampleHeaders} activeIndex={1}>
        {sampleChildren}
      </Tab>,
    );

    // Check if the second tab's content is visible on initial render:
    expect(screen.getByText('Content2')).toBeVisible();
  });

  // Other potential tests:
  // - Verify the ripple effect (might be complex to test, depends on implementation)
  // - Verify the underline movement on hover/click
  // - Verify responsiveness or any other dynamic behavior of the component.
});
