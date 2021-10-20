import {
  css,
  FlattenInterpolation,
  ThemedStyledProps,
} from "styled-components";

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

class AnyIfEmpty<T> {}

export const mxm = (
  width: number,
  rules: FlattenInterpolation<ThemedStyledProps<any, AnyIfEmpty<any>>>
) => css`
  @media screen and (max-width: ${width}px) {
    ${rules}
  }
`;

export const toHex = (hex: string) =>
  css`
    ${hexToRgb(hex)}
  `;
