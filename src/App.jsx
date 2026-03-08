import { useState, useCallback, useRef, useEffect } from "react";

// ─── Base64 Images ───
const CHAR_IMG = "data:image/webp;base64,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YmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTgxQ0UyMkRERDhDMTFFREIzMzc4NTBGOUFFMzYwQTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTgxQ0UyMkNERDhDMTFFREIzMzc4NTBGOUFFMzYwQTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzYzQTIxREE5Q0M4MTFFQkEwRUVBRkEwNTkxNUE4MDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzYzQTIxREI5Q0M4MTFFQkEwRUVBRkEwNTkxNUE4MDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4A";

const CHAR_LOAD_IMG = "data:image/webp;base64,UklGRgYMAABXRUJQVlA4WAoAAAAMAAAAbgAAiwAAVlA4ILoIAADwKQCdASpvAIwAPpE+mUkloyIhKjWcQLASCWQA0m46YH6j/pPOLtP+b4Q07UMfbk+YDzevST/hPR06m3eW/KZ1ULq727/6jpn/gEwCmLxj75+AE7vtAvar7B37OpT34/UDYi5k/+N9E7QS9cewb0wvR6/aNEt5nmPoKGfabd3oHwavXKwoKXofW8yKLFCG4c688jb2OBu9GJdYbBnPg179Hup6lSUde8H+vBmoTgtKXER2hpY1ykc6H80kvUALrx1+6ydH9XKDLBwBlbY4C+6PchJEO6uTH+ZAV9IWHgFPJyPSbGgHX1ffM7+DtUhy8nd0abqyW5KeGBTFwipv8IFkbDsT53JgTgNgnZNl9vIxFRQQ0VXayf3Ipc/v6VHfE7Gc61OqQ2zs2rFpsV2Yl820Y25r57HCj+vjIVSdxrPxObgfHuP2GYclBdlPyCP8l0n6tb9wPWa0AAD++/YBypG+8lyleLWy5IKFkZhuKq9CmRqf28940S/XZYSa5udC2p2Z/QEzq8E3FZvbsgSvAQIsvvH812zHD53FXPAhj7drYdAe9iShspQIwEWeVBP06zx4gB0NnmIEOi6D99mkV31+nTD8iwieBM7fy8Q4E4Fs9YF1bKm/D79kIfG26mb/g6MZ6eQAvg80mc61LyoCoJRHwERZBJcjWFxSqUfYvcEDnxoThkDzCnN1tT3kHhAgBOGlh91UWQqcCEdIqe/wo5E1sE3uL/7QyJENf1LB8yvoV8JUuyGBmLwDsp9pPYAwQhXOVD70pQ5bJSxbDc/qcgAlLXxqrBYZdhv9srB+ToJebVKbTm1kj/MvhBNGxJAp2jMvIizl+kYMam3j92OwgijzVyNjv0KtQ3vdGX5pIlQie/k/Snigo0ttXt4K9ilOPHgJVQyHQpsYZBH5wozOfB+/3t8u4odiZjeNU2jGbcjy98jNkXTCMCCrA06TieEpoaRbrndqxMBPL3Ru2KCak6lXSthiodxFWcLrHP/i/r9pPYuT3GHiWqm6rWVn7qXlSPj9xl914kpTPqAAdBKKYHVCCHzyIKzsqJrDQ2mBbeenyt/Lrn3vTYGevoLSiTXTAAUM+Zjv23U2z/WZBEnBU6iq8DdGu+Jy+M1arXjYgqzPaOvTV4yo8sl8V7IMspr6s7UXww2MR3NAiSuhk2nMyXVd2Qc91K6R1IU97xvYWf4/1cWWi8X/xFMdA6sGjsdMQjMCLq/9UdMyxWC/bQhf6Dp8Pjrng4JZYWma0z0DAOwORG3MfT9kCUMx+0pPVWhm/PEIx5wRmLIEV/EYBEuaI8o3qI8DJkH4ejK3pfCt0Q+gt/3uMoCbe+N9s3eEeZVVxG3ZprjxNeiQB5GyIZZx9NhozJTnfpoWRDerSpTlJcOhtVjvDc3b9NNTfxLuYPZ9DJ9fVcg42FIJoBDJX2WOU/W9WGQLzfezQMUEJjwYGW1Th9KCoUwq0N7Sv3mlhjIMH6OgnQLl6bgxtYNThg4oJ9PIMR2RnmIN6JiMxSbn13K5Z9atuEXzp3Zw7jbZwCRkacCqhLPV7o7PkfnjEsScIlGVzirbBbdIKcENN5cLlmMBcC4G9Wj83SMeF+9wI9sydcJUp8D/m0TuOD6Qn48MTEpZUyhhZxjpEhwyPaCCqfR9haPsva+CpKXFjrU+H6NF4O/vJkOB5rnQo7HaFJBltiqNNN6wcNq9fR/vbkxJKkIKcl2OyNY5tu1XPu6+igEBSLwmDHrGVDQvlqweor8BfTFbZ4AOTqsHFQqRSnrSwknmvURTcLZDbXse3lPSExQh1HXRjSMJhaK6iTc4Fq0XXwIWCralYteYvRQ7S8X7+75JEsmYK1ZAS9VY/1LbJbv9Rs4ryQ3naBDvkMYOkClytzx/e6RjpsJeFRW65P4qlZChv8ctKAZ1U9MWGy6JHuo7UBk61d+aFXII1OvOuftvHyf67efgGUVT1/1nH+Sf3D0+FzGEeI++3CZYIFQ3p8EFG9qouqVtbNZ/CCGkrU/+VtNF1YLQxP5Am8skGq5YYXRaOBIRte0yPLPTxOAPdEoqjhBEpVj/IVViKbBhT7DI00rz1n0aYvQMLDEcYWh6yuMbhcAeiCOJVGib4R4mLV/fEn1KefTlLH1WU2Yjak+ZqRi76UOYBiRb0OFE8u05kmVfHaHDAqrbR72ALpdFwl85QWqgWlPAFzMsP+xWdeAxDIYBlpeqakv+XcXKLROtOBH3Hyy7bnZ8pROQtrlpNDxcxPDX7aFncD5CvPOlMuPLtUZWYMNX0EqsdaIYf5lq2zgileUMNhZHRG0GZ9LJQjpl3KfdLBmTEOTqFCYm+sis8xYd54mpYbyoTlZIcjqwOR0Rk7StTwjrdZvV8kaekJZPalzwiiWq5olJaApPH0iiDwiAGHv+pjxDK+jawmg5d1N6lmF+E88cUTq33khYyOwY5edJUwLQ6nBtxU2JlJEo/0qao7h9oGp0aCf0/onhwkrGzuN4ez76KA+iYjjmvmi78WjIrUTkX5PvW1JC/QEayLSFZV7e1VR9uO4hekBYR3pUNiiT6JDJsoEKzryHcIVZW1bS3MqSVNdaUqSeC7NxiOixRj0DspmORrzXdZy5XVybHUPLDFv+yP4j/d5hKtOKCt6/Rk2X0BdyZY6JFq7raiVx/N9eu/8MHbiT6N+/OKQUihaCN0rAcSSXK3Pw6WFM43D4bFtandCu53KtWUaA2GNcOGxH/G2uVRhK5EcFpgt/8p5hrmwxkEXc52FHxC4eZLZz4qlsDs0KHMfxCq1tRrnjv3jmltXBwx1F1vr5Qe/YngFrK/k7DanP2p2v13zXCrUQaCHBnuPsCMnAjmpfklOg3PvA8RFLY5bNhzKOrhZGlriFgmU/XLbmgqHNo8YeTx6fkTc/iJuX82gXWSTKcnfRB6WFNh+EllCKj38v1/AEhe7LWYXNI51+kARkVMhHLuIJwIWhG/KVMwTD5VAKj9Yl//yIFIZzYsAAAEVYSUYQAAAASUkqAAgAAAAAAAAAAAAAAFhNUCANAwAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRjVBNjY1MEREOEMxMUVEQTZCMThEMjZGNDhERUQ4RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRjVBNjY0RkREOEMxMUVEQTZCMThEMjZGNDhERUQ4RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNjNBMjFEQTlDQzgxMUVCQTBFRUFGQTA1OTE1QTgwNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNjNBMjFEQjlDQzgxMUVCQTBFRUFGQTA1OTE1QTgwNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgA=";

const QR_IMG = "data:image/webp;base64,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";

const CI_IMG = "data:image/webp;base64,UklGRmwOAABXRUJQVlA4IGAOAACQOgCdASqgAHUAPm0wlEckIqIhKTZL6IANiWYIcAGS2l/9u1/jw/nF1Z/Cf0rkup28pXnXxkeon8y+wB4wH63e4v9lfUB+4PrAf5f1K/4v1AP7d/desM9Ary2P3Z+EX+2/8H9zvazzT3+wdq3+F8NfFx5w9r+ZBEU+U/bD8d/cP3H9if9p4O/HD+k9Qj1r/i/Rh+e7RIAH5n/S/9Z/bvGU/wvQD7AewB+rf/R41ryD2B/0d/3/Tr/7/9R56/p3/y/5P4EP1s/5P3D/Or7Gv3V9pz9wD9CuObK30kFICSwsK+3S3b8bI+iJbIqHHNDIrIK+nqZNhCs6XfMP/cLKUbC7yvhgflLimcdd9Fxr4pIGJ0H96fd+kfP1d73NIAbpUN+S98V4H0Cyh0C72hm+cHmrIbVodJwK6IWnM73xBPht1cev8u1pkSHeklKy+jXN31z35L/NYigqmeWAzYzEacpEi85VscKweAKWdxcFxBTH9pMXwwmlMrTHEgQpHk03a35TxD/1qAtuwUyVc1Vfsm9uS9SJhct0jeToBkXa0WUCwsgAs7wTi2R9hTeRvWmvEezvTQpYQKnERqhjY61SMt2ofre3yY7l69swhfdLR3RZwJP+T2s/sqe6UJTYFAAA/tGAANYHBF9K4RpxWI0GMldrHTgXrzHm5WGkNvxi8wIWcaAHI2+D60num2qIaFVYBO+nqw1WEjaDAVCohfnMVoZmJcFDhnOLpbTMoDe3XLjLud9hdwAGfF0ZuidUKJZJnrLC6hdBxeMPLr3K/W/brAAIz2Bdl9LLxw/OpbIPCvfh84Py136K/XgmDR739h5yEVBsGRYfzgYahPm0ZA6vTuvfcb+3EMmf9bXJ0P8x5lC78pDTz3oEoVzSAbT1zjVa10MdAMaNAuwoIzlNeJXk8rA3Yk0KBmdB+EEGizEj+C5+boMdoUuY9sLmpqkqJ+MI0fBqLe3rxJNzhiPkXZ91acLAAPQBmbggtiYyAB2KvyHAR0xxO++PWffkp2cOCfEnWqvacsMilqEKefML0DPyONjcyrMsi0Z29a83S10S1zhvwauVNU8QkvGQ8OVqxoVgnIEc2G/opkXhaCnv6SbJIgee+Ee465kl2lmwgZI6PPUiLMvxLe69zxxhfvmMJV83MEQo0Tyz4HKiNiM0uGexqyzDwXE8n0pZQgjjM114h90Pp6210G5AQKHt9azU39zHSls1qqyzJu5tW0kx7dImebdbQhfyfy00y3/Yx/AEkHuU9jJ7o9Mq+3vL5OD6RMmO5/z4uYqaDwK1Xg36hMYv3OrB+rN+RK19ES8erQoUjxhcn0I6dqmhIBJPNoXoXoYoX4P+Al/xq1zGbBfPiG1/nh4+GlHfxWoxrGbtHmbTkz1ATnSYUaxaBOm0leE/x2oj6ks3mmZdt+/Ft/aJRs2qn8r1FEHKzcDrTf7CcY0c0etgvKCvndW3VfxayrvtLa8GIAaW0YQHvWKE9guvapwwxwA/8G9HH1LD4/D4+M+bDTeby70HSwTJhdxLGDydF/BBubL5B6fPUSr1L+Xg+eOPXSqwn9+xVxqjBTV6ssjZWJP2aQXWzUskcHEHeZTaE+khlO4lmHmG/gU2yE5urIEIqz/5vMjbdJhuS/RSijk8rbONo9mZIomlo/Gszd2ZWuB7TOWwNDnKLnqaJA7ZReLdp2kQ+tEwvv83XZ2rBqT4OOwO3an6KaNI+kSQSWQNWLrKMOFwyuXoNhxArxPjhOVzpN/axdZWPFk6+xiUgUSMH5xpJInthcVW//tjlb9s7y6q4kCXqQf/89VyZbv7jb/f9pH1zWOyYv0thGhWvHruzqAPrzTpPNYPu1SFI6I0GBkZj6O3S4i1IfYvIcX7Ztt0uz/rCKr1IZDggksd6K+f5W5ZMwVHjEI38p6NICobnaszGs8W7/MGplTG+PzeklD1ZfYnEjn2dPrhpJOIRZkXMDAvtwTxFzOVu14LuIwhymvup7dUYnJ8s4cCBNVKy3FyvpXU+Ik0xNB5o80JztMXXxvBlRVLH8YBsz/ULHMKui26bzzu4GOYNVNsAV8JpGv76sdyEp8uDrQnfG3A5F/scEMvVo5ZNFOjMEqo3nwyOS6DydfIHH04hvrw1mNffjk/1fx4cekempYIKVJKS3zZ27QxhQ84FAPBoEKx2fmAHyYCpTmGMr/54AcssJZfRtLXMAmwoJf7ElnkNMNjN0YZAhdglAMGUvAK7K+PZLlbWbCB6TD4IV8JWuNhr6lSpXHrMUxqNSQoaXmuISPlKN/tijtq2MkRfQPhc1KVpmokQlQrfus7rIeX9gsd5r0nENVYG4rezz5ssc4QPjUj5Oj1pZHPk7R2/yjrfLi2whlMLjJXCiQJpG4s2uTmW4/Npy8l/L9dmwTA/b3dXfk2KVSGlfQxavxpw3U91VfjXhoGaiCvq9+tksa+opjKRkj2+QmotSyxP+qNek547rbK5U2UpkX0/vju529b9JAiCHJ3mIyTi2SeiKyUNoVj4mCMtPpzGvUlHiJaQ7nbnY7uXrLeHCItdNyHLAwNrMvPJr3Vota/RQ8gzMlauySf3LFWF1qAeS0e/OtnoqLZJQG/Ezu47x4EmtXlIkO1DpGiYXRVyfSAb3TayYjIuCNVpbwtLCya5RRS1bKuadDLsKY07ZDMHQZMunfCo1MKbcD2U+nMsPgMQHY8rpG5lanCHR7Z2edXIFU3Gr0RS0tHv8bVdJ1JCq5L8vM5D3fJmUz+3jWKGD3FsMctEMwdRxGsIEovjFFENlpTYsCxiSxL/XHjBGBhaMvYOwwP6GQPo47zoqbOUsY5yAtvvk1f2+MhIKbz/4podzja258X1/iDq29/aHBcYAgcljuOx0SJgvkGDcbYuwiBHsw6KMvZh2EZoDMWDC4bsNMR6Z5kgyLchlFglDkSxPQC+O7LPtMRhOtcD516FGrlAquFZ6wCs1DRyQ+QoZ/eMuB/vn+qUZPWFEB3MB68vhlpxeWm6CB6XnTnPhr2oBIvaiayEtm7cfbxSQeqt60hdebJus5XDjt1hkOh8G65qEGENovPZNQtLDx/8/fb1Bfr0fvEhYGC9iYzwzDuA7N3zbVhLyYylrAffvtpdHqCPg0H2jCwhi4sG/6I86rwdUnXSfM215x8qFPTyAD074SfLASTbJ8xxA4sUI7Z3EYOEYJMrY5Z4Nt3ZGgjWQszf7nsjKR//4i+S4+h4+Rl6/ZPSjOoHk/U4xFuhj8MzYYx3Rb8YCUxENpnwfYh6B2l+shADqCrN37gaH5berOmi1QCiYGwumFJEUHrlfSCdP/whPKBQbAAofbz9+y/cGOAzQGpfk1n8/5DfSuVzSiZkOOrXzeZ1URV2tMx8ZUD7cz755f6Ad2uJlKOs6/X3g5vbahmawuuc1PbGzYEDn+fMg4DrVwddo3Zo9xI0bYY9/LlBnNlJ+BZ1ydmDfMx/4Rx3jKI8RC58nF1r2UfNvkgFlqPjl9wD18HgX6nPMFZS9b5ZtubsCDSQVNxuQecp/ImIJqF8BH5axCdUCVtiOdfto87FgjvFAw/S3jE0y2fBfMRQpifTd5yDtqCzhDNhiTa7lqHMjIUPxTJEbWILYoK/5Atn/6e87Kty0XW47MI4S2cigh6tsunXZQFmXOj9d/zGrw4R37EmwKKALrFTdHNdjv54J9vT8Aq/KKqpv9KFax5t1oB9RUAtVfItjLwlwT28KyIJxL2RehtAs7+HNaso8MyMZ/fhn0Fbrh3Wdr8rMq4lFr266RZJlp4DgmkwSC6u1/sNs+dDjMwO+BxmcaVek7w115GKdf/L9DkXU+RJ6d4HkdyzclRjIRdnkfjS43/aqSFCe6YNMCRkOtNwyuPqO3XKl+QQb+APDszkrHHUEHDS+Rl3CaeAPX4iatFrDlUiHLb9kjUVVkIztcicjd+lL9m1Wm2gVion1EO87IZnkVOblX8ZZEp7pivQd+VgxkjgKXbziN2VfHjeI4aDjRqqGQmenwqP5TF+1duTGlTsSJStPRUvFBYU1tX5p+q3AsTnxyQ6cPc4a/W/Do2Xafb5kHvaVsnyBFsZXCrK4ndeMa/s3Tv5SX5f6MvzAZQ5/eY4GE4RCuAnmdxs1Ikclsq3A437RPSHmpbMW03X1rSEbkJYlsgvYW5zMwMGP408yMMrJT/YmHS1L0SChOWCzGVsYit/KHt9r8uwEzQhDzGddIB/MqH/nknXy0l4NQfiEdwc+iSDVkiC2k873nylM3sfvEYJnTvE+nJdFxMfpEx16Vl0s1HnakGOLT3pDAtnbAT/15qAnZZ0oGVDeUXBEbFpa7rkO5H6SeFjomHy+dKtmdVFsvvJy2JwIEEGu1FES1GWnpJz94dNdf10LzbU0LPzdTKtccjvVBni024Sv6hkK09n1AITipNbtJz+wAtx2l0yOJWZpV1D5G+x39RbTCftC9XdcUO3y39K6B5kn5aH54/uHehJGUxRtffpB8B+M6m6KbhfXs6o/IuV5zV1pQ9+lw6immZT6fejvWe3ZyJgACa8n/aImPHJbHjtRo9f3mdfeUM12LyD27/eogg8qR6UzqJhktkxOXs3/YqOaFwTz3Nc5GXYrdh8kNoKMPnrZntKzt7hLEThn8uMJ+8qW1wu6CT8oLaA+3C6ZUmMfXpiCUajIQphh/sAVmOOAvUTp944UMHDse6GW/ELANGKHkd8Dqt7HWP/KYZ+c4z5P0wJgFZ9LUpi7wYTGdiaiQro8U/7YmCKVCkd7HolyWvsaeHNlIkWHuhQYruzyeGfzQE9k6ax/z7A2m5Qr7Bn9FaRPX66u6rI6c7wqB2JYVmq9/lNyYR0ylzV2iG5uhzg7T6QrtzS4MwiBpNNAisneMq/w9n+OtXwPuXvp13/F6al9QZYmiKifTsQ/VPluo00Q9Abb04AAAAAA==";

// ─── DATA ───
const CATS = [
  { id: "주민등록", icon: "📋", sub: "등·초본, 전입세대" },
  { id: "인감·본인서명", icon: "🔏", sub: "인감증명서, 본인서명" },
  { id: "가족관계", icon: "👨‍👩‍👧", sub: "가족관계, 기본증명서" },
  { id: "토지·건축", icon: "🏠", sub: "토지대장, 건축물대장" },
  { id: "세금·수수료", icon: "💰", sub: "납세·과세증명서" },
  { id: "복지·지원", icon: "🤝", sub: "기초연금, 아동수당" },
  { id: "자동차", icon: "🚗", sub: "등록원부, 주소변경" },
  { id: "병무·기타", icon: "🎖️", sub: "병적, 출입국증명" },
];

const ITEMS = [
  { id:"r1", cat:"주민등록", name:"주민등록등본", tp:"제증명", fee:400, desc:"세대원 전체 주소·인적사항" },
  { id:"r2", cat:"주민등록", name:"주민등록초본", tp:"제증명", fee:400, desc:"본인 주소변동 이력" },
  { id:"r3", cat:"주민등록", name:"주민등록증 발급사실확인서", tp:"제증명", fee:0, desc:"주민등록증 발급 이력" },
  { id:"ra1", cat:"주민등록", name:"전입신고", tp:"신청", fee:0, desc:"이사 후 주소 변경" },
  { id:"ra2", cat:"주민등록", name:"주민등록증 발급신청", tp:"신청", fee:0, desc:"만 17세 최초 발급" },
  { id:"ra3", cat:"주민등록", name:"주민등록증 재발급", tp:"신청", fee:5000, desc:"분실·훼손 시 재발급" },
  { id:"ra4", cat:"주민등록", name:"주민등록 정정신고", tp:"신청", fee:0, desc:"등록사항 정정" },
  { id:"ra5", cat:"주민등록", name:"세대주 변경신고", tp:"신청", fee:0, desc:"세대주 변경" },
  { id:"ra6", cat:"주민등록", name:"세대합가·분리신고", tp:"신청", fee:0, desc:"세대 합가 또는 분리" },
  { id:"s1", cat:"인감·본인서명", name:"인감증명서", tp:"제증명", fee:600, desc:"인감도장 증명" },
  { id:"s2", cat:"인감·본인서명", name:"본인서명사실확인서", tp:"제증명", fee:0, desc:"본인 서명 증명 (인감 대체)" },
  { id:"sa1", cat:"인감·본인서명", name:"인감(변경)신고", tp:"신청", fee:0, desc:"인감 신규등록·변경" },
  { id:"f1", cat:"가족관계", name:"가족관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"가족관계 사항 증명" },
  { id:"f2", cat:"가족관계", name:"기본증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"출생·사망·국적 등 기본사항" },
  { id:"f3", cat:"가족관계", name:"혼인관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"혼인·이혼 사항 증명" },
  { id:"f4", cat:"가족관계", name:"입양관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"입양 사항 증명" },
  { id:"f5", cat:"가족관계", name:"친양자입양관계증명서", tp:"제증명", opts:"일반,상세,특정", fee:1000, desc:"친양자입양 사항 증명" },
  { id:"fa1", cat:"가족관계", name:"출생신고", tp:"신청", fee:0, desc:"출생 사실 신고" },
  { id:"fa2", cat:"가족관계", name:"사망신고", tp:"신청", fee:0, desc:"사망 사실 신고" },
  { id:"fa3", cat:"가족관계", name:"혼인신고", tp:"신청", fee:0, desc:"혼인 사실 신고" },
  { id:"fa4", cat:"가족관계", name:"이혼신고(협의)", tp:"신청", fee:0, desc:"협의이혼 신고" },
  { id:"l1", cat:"토지·건축", name:"토지대장 등본", tp:"제증명", fee:400, desc:"토지 소재·면적·소유자" },
  { id:"l2", cat:"토지·건축", name:"임야대장 등본", tp:"제증명", fee:400, desc:"임야 소재·면적·소유자" },
  { id:"l3", cat:"토지·건축", name:"건축물대장", tp:"제증명", fee:500, desc:"건축물 현황 증명" },
  { id:"l4", cat:"토지·건축", name:"지적도 등본", tp:"제증명", fee:700, desc:"토지 경계·형상" },
  { id:"l5", cat:"토지·건축", name:"토지이용계획확인서", tp:"제증명", fee:1000, desc:"토지 이용계획·규제사항" },
  { id:"l6", cat:"토지·건축", name:"개별공시지가확인서", tp:"제증명", fee:800, desc:"개별 토지 공시지가" },
  { id:"l7", cat:"토지·건축", name:"개별주택가격확인서", tp:"제증명", fee:800, desc:"개별주택 공시가격" },
  { id:"l10", cat:"토지·건축", name:"전입세대열람확인서", tp:"제증명", fee:400, desc:"해당 주소 전입세대 열람" },
  { id:"t1", cat:"세금·수수료", name:"지방세 납세증명서", tp:"제증명", fee:0, desc:"지방세 납부 증명" },
  { id:"t2", cat:"세금·수수료", name:"세목별 과세증명서", tp:"제증명", fee:800, desc:"세목별 과세 내역" },
  { id:"t3", cat:"세금·수수료", name:"자동차세 납세증명서", tp:"제증명", fee:0, desc:"자동차세 납부 증명" },
  { id:"w1", cat:"복지·지원", name:"수급자증명서", tp:"제증명", fee:0, desc:"기초생활수급 증명" },
  { id:"w2", cat:"복지·지원", name:"장애인증명서", tp:"제증명", fee:0, desc:"장애인 등록 증명" },
  { id:"wa1", cat:"복지·지원", name:"기초생활보장 신청", tp:"신청", fee:0, desc:"기초생활보장 수급 신청" },
  { id:"wa2", cat:"복지·지원", name:"장애인등록 신청", tp:"신청", fee:0, desc:"장애인 등록 신청" },
  { id:"wa3", cat:"복지·지원", name:"기초연금 신청", tp:"신청", fee:0, desc:"65세 이상 기초연금" },
  { id:"wa4", cat:"복지·지원", name:"양육수당 신청", tp:"신청", fee:0, desc:"영유아 양육수당" },
  { id:"wa5", cat:"복지·지원", name:"아동수당 신청", tp:"신청", fee:0, desc:"만 8세 미만 아동수당" },
  { id:"wa6", cat:"복지·지원", name:"한부모가족 지원 신청", tp:"신청", fee:0, desc:"한부모가족 복지급여" },
  { id:"wa7", cat:"복지·지원", name:"긴급복지 지원 신청", tp:"신청", fee:0, desc:"위기상황 긴급지원" },
  { id:"a1", cat:"자동차", name:"자동차등록원부(갑)", tp:"제증명", fee:300, desc:"소유자 등 상세정보" },
  { id:"a2", cat:"자동차", name:"자동차등록원부(을)", tp:"제증명", fee:300, desc:"저당·압류 등 권리관계" },
  { id:"aa1", cat:"자동차", name:"자동차 주소변경 신고", tp:"신청", fee:0, desc:"이전 후 주소변경" },
  { id:"m1", cat:"병무·기타", name:"병적증명서", tp:"제증명", fee:0, desc:"병역 이행 사항 증명" },
  { id:"m2", cat:"병무·기타", name:"출입국사실증명서", tp:"제증명", fee:2000, desc:"출입국 기록 증명" },
  { id:"ma1", cat:"병무·기타", name:"대형폐기물 처리 신청", tp:"신청", fee:0, desc:"대형폐기물 배출 신고" },
];

const QUALS = {
  r1: [
    { qid:"r1q1", nm:"본인 및 세대원", docs:[], ex:false, nt:false, tg:[], nc:false },
    { qid:"r1q2", nm:"가족관계등록부상 가족", docs:["신청서"], ex:true, nt:false, tg:[], nc:false },
  ],
  r2: [
    { qid:"r2q1", nm:"본인", docs:[], ex:false, nt:false, tg:[], nc:false },
    { qid:"r2q2", nm:"세대원 (위임)", docs:["위임장","위임인 신분증 사본"], ex:false, nt:false, tg:[], nc:false },
  ],
  s1: [
    { qid:"s1q1", nm:"본인", docs:[], ex:false, nt:false, tg:[], nc:false, note:"본인 직접 방문 필수" },
  ],
  f1: [
    { qid:"f1q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f1q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f2: [
    { qid:"f2q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f2q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f3: [
    { qid:"f3q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f3q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f4: [
    { qid:"f4q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f4q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  f5: [
    { qid:"f5q1", nm:"본인", docs:[], ex:true, nt:false, tg:[], nc:false },
    { qid:"f5q2", nm:"부모/자녀/배우자 등", docs:["신청서"], ex:false, nt:true, tg:["자녀","부모","배우자","형제자매"], nc:true, note:"대상자 수만큼 신청서 필요" },
  ],
  l10: [
    { qid:"l10q1", nm:"소유자", docs:["신청서"], ex:false, nt:false, tg:[], nc:false },
    { qid:"l10q2", nm:"임차인", docs:["신청서","임대차계약서"], ex:false, nt:false, tg:[], nc:false },
    { qid:"l10q3", nm:"경매참가자", docs:["신청서","경매공고문"], ex:false, nt:false, tg:[], nc:false },
  ],
};

const OPTIONS = {
  f1: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f2: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f3: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f4: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  f5: [{ name: "주민번호 공개", choices: ["뒷자리 공개", "뒷자리 비공개"] }],
  r1: [{ name: "과거주소 변동사항", choices: ["포함", "미포함"] }],
  r2: [{ name: "과거주소 변동사항", choices: ["포함", "미포함"] }],
  l10: [{ name: "말소·사망자 표시", choices: ["표시", "미표시"] }],
  s1: [{ name: "사용 용도", choices: ["매매용", "금융기관 제출용", "기타 일반용"] }],
};

const AI_DATA = [
  { q: "전세 대출 필요서류 발급", ids: ["r1","r2","s1","s2"] },
  { q: "집 팔려고 하는데 서류", ids: ["s1","r2","s2"] },
  { q: "아이 어린이집 보내려고요", ids: ["r1","f1"] },
  { q: "이사해서 전입신고 하러 왔어요", ids: ["ra1"] },
  { q: "출생신고 하러 왔어요", ids: ["fa1","wa5","wa4"] },
  { q: "등본 떼러 왔어요", ids: ["r1"] },
  { q: "인감증명서 떼러 왔어요", ids: ["s1"] },
  { q: "취업서류 발급해주세요", ids: ["r1","f1","m1"] },
  { q: "기초연금 신청하려고요", ids: ["wa3"] },
  { q: "전입세대열람확인서 떼려고요", ids: ["l10"] },
];

// ─── STYLES ───
const C = {
  bg: "#F5F5F5", card: "#FFFFFF", mint: "#2AC1BC", mintLight: "#E6F7F6", mintDark: "#1A9E99",
  text: "#1A1A1A", sub: "#999999", desc: "#666666", amber: "#D97706", amberBg: "#FFF7E6",
  red: "#E84545", redBg: "#FFF0F0", green: "#22B573", greenBg: "#ECFBF3", border: "#EEEEEE",
  font: "'Pretendard Variable', Pretendard, -apple-system, 'Noto Sans KR', sans-serif",
};

const fmtFee = (f) => f === 0 ? "무료" : f.toLocaleString() + "원";

const CAT_ORDER = CATS.map(c => c.id);

const sortByCategory = (cartItems) => {
  const groups = {};
  cartItems.forEach(c => {
    const cat = c.item.cat;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });
  // Sort within each category by item id
  const idOrder = ITEMS.map(it => it.id);
  Object.values(groups).forEach(arr => arr.sort((a, b) => idOrder.indexOf(a.item.id) - idOrder.indexOf(b.item.id)));
  // Return grouped in category order
  const result = [];
  CAT_ORDER.forEach(cat => {
    if (groups[cat]) result.push({ cat, items: groups[cat] });
  });
  return result;
};


// ─── NEW: Centers (대기현황) ───
const CENTERS = [
  { id: "hansol",   name: "한솔동",       svgX: 119, svgY: 173, wait: 3  },
  { id: "areum",    name: "아름동",       svgX: 163, svgY: 166, wait: 5  },
  { id: "jongchon", name: "종촌동",       svgX: 140, svgY: 161, wait: 12 },
  { id: "dodam",    name: "도담동",       svgX: 117, svgY: 152, wait: 8  },
  { id: "boram",    name: "보람동",       svgX: 104, svgY: 144, wait: 2  },
  { id: "daejeon",  name: "대평동",       svgX: 135, svgY: 185, wait: 0  },
  { id: "sojeong",  name: "소정면",       svgX: 192, svgY: 68,  wait: -1 },
  { id: "center",   name: "행정복지센터", svgX: 109, svgY: 199, wait: 5  },
  { id: "jochiwon", name: "조치원",       svgX: 254, svgY: 19,  wait: 3  },
];

// ─── NEW: Glossary (행정 용어 사전) ───
const GLOSSARY = {
  "등본": "주민등록등본의 줄임말. 한 세대(같은 주소)에 살고 있는 가족 전체의 이름·주소가 나오는 서류",
  "초본": "주민등록초본의 줄임말. 본인 한 사람의 이름·주소 변동 기록이 나오는 서류",
  "인감증명서": "관청에 미리 등록해 둔 본인 도장(인감)이 진짜임을 증명하는 서류",
  "본인서명사실확인서": "인감증명서 대신 사용할 수 있는 서류. 도장 대신 본인 서명으로 확인",
  "전입신고": "이사한 뒤 새 주소지 관할 동 주민센터에 '여기로 이사왔다'고 신고하는 것",
  "세대주": "주민등록상 한 세대(집)를 대표하는 사람",
  "세대원": "세대주와 같은 주소에 함께 등록된 가족 구성원",
  "위임장": "다른 사람에게 대신 일을 맡기겠다는 내용을 적은 문서",
  "가족관계증명서": "부모·배우자·자녀 등 가족 관계가 기록된 서류 (법원 발급)",
  "기본증명서": "출생·사망·국적 변동 등 본인의 기본 신분 사항이 기록된 서류",
  "혼인관계증명서": "결혼·이혼 이력이 기록된 서류",
  "제증명": "관공서에서 발급하는 각종 증명서의 통칭",
  "수수료": "서류 발급 시 내는 비용. 대부분 수백~수천 원 수준",
  "정부24": "정부 민원 서비스 포털(gov.kr). 집에서 인터넷으로 서류 발급 가능",
  "대장": "토지대장·건축물대장 등, 부동산 정보가 기록된 공적 장부",
  "지적도": "토지의 경계선·모양·위치를 나타낸 지도",
  "개별공시지가": "정부가 매년 발표하는 개별 토지의 단위면적(㎡)당 가격",
  "과세증명서": "세금이 얼마나 부과되었는지 증명하는 서류",
  "납세증명서": "세금을 다 냈다는 것을 증명하는 서류 (체납 없음 확인용)",
  "전입세대열람": "해당 주소에 누가 전입 신고되어 있는지 열람하는 것. 부동산 거래 시 자주 사용",
  "임대차계약서": "집을 빌리는 사람(임차인)과 집주인(임대인) 사이의 계약 문서",
  "기초생활수급": "소득이 일정 기준 이하인 가구에 정부가 생활비 등을 지원하는 제도",
  "한부모가족": "부 또는 모 한쪽만으로 이루어진 가족. 정부 지원 대상",
};

// ─── STYLES ───
const C = {
  primary: "#0066CC",
  primaryDark: "#004A99",
  primaryLight: "#E8F4FD",
  // Prep page 색상 (기존 mint → blue로 교체)
  mint: "#0066CC",
  mintLight: "#E8F4FD",
  mintDark: "#004A99",
  bg: "#F5F7FA",
  card: "#FFFFFF",
  text: "#333333",
  textPrimary: "#333333",
  textSecondary: "#666666",
  sub: "#999999",
  desc: "#666666",
  border: "#E0E0E0",
  amber: "#D97706",
  amberBg: "#FFF7E6",
  red: "#E84545",
  redBg: "#FFF0F0",
  green: "#22B573",
  greenBg: "#ECFBF3",
  font: "'Pretendard Variable', Pretendard, -apple-system, 'Noto Sans KR', sans-serif",
};

const fmtFee = (f) => f === 0 ? "무료" : f.toLocaleString() + "원";

const CAT_ORDER = CATS.map(c => c.id);
const sortByCategory = (cartItems) => {
  const groups = {};
  cartItems.forEach(c => {
    const cat = c.item.cat;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(c);
  });
  const idOrder = ITEMS.map(it => it.id);
  Object.values(groups).forEach(arr => arr.sort((a, b) => idOrder.indexOf(a.item.id) - idOrder.indexOf(b.item.id)));
  const result = [];
  CAT_ORDER.forEach(cat => { if (groups[cat]) result.push({ cat, items: groups[cat] }); });
  return result;
};

const waitColor = (wait) => {
  if (wait === -1) return "#999999";
  if (wait <= 3) return "#22B573";
  if (wait <= 7) return "#F7941D";
  return "#E84545";
};
const waitLabel = (wait) => {
  if (wait === -1) return "비운영";
  if (wait <= 3) return "원활";
  if (wait <= 7) return "보통";
  return "혼잡";
};

// ─── GlossaryText 컴포넌트 ───
function GlossaryText({ text }) {
  const [activeKey, setActiveKey] = useState(null);
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

  const positions = [];
  terms.forEach(term => {
    let idx = text.indexOf(term);
    while (idx !== -1) {
      const end = idx + term.length;
      const overlaps = positions.some(p => !(end <= p.start || idx >= p.end));
      if (!overlaps) positions.push({ start: idx, end, term });
      idx = text.indexOf(term, idx + 1);
    }
  });
  positions.sort((a, b) => a.start - b.start);

  const parts = [];
  let pos = 0;
  positions.forEach(({ start, end, term }) => {
    if (start > pos) parts.push({ type: "text", text: text.slice(pos, start) });
    parts.push({ type: "term", text: term, key: `${start}-${term}` });
    pos = end;
  });
  if (pos < text.length) parts.push({ type: "text", text: text.slice(pos) });

  if (parts.length === 0) return <span>{text}</span>;

  return (
    <span>
      {activeKey && (
        <div onClick={() => setActiveKey(null)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
      )}
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.text}</span>;
        const isOpen = activeKey === part.key;
        return (
          <span key={i} style={{ position: "relative", display: "inline" }}>
            <span
              onClick={e => { e.stopPropagation(); setActiveKey(isOpen ? null : part.key); }}
              style={{ borderBottom: "1px dashed #0066CC", cursor: "pointer", color: "inherit" }}
            >{part.text}</span>
            {isOpen && (
              <div style={{
                position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
                transform: "translateX(-50%)",
                background: "#fff", border: "1px solid #E0E0E0", borderRadius: 12,
                padding: "10px 14px", width: 230, minWidth: 180,
                boxShadow: "0 6px 24px rgba(0,0,0,0.14)", zIndex: 999,
                animation: "fadeIn .15s ease-out",
              }}>
                <div style={{ fontWeight: 700, color: "#0066CC", fontSize: 13, marginBottom: 5 }}>{part.text}</div>
                <div style={{ color: "#333", fontSize: 12, lineHeight: 1.6 }}>{GLOSSARY[part.text]}</div>
                <div style={{
                  position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                  borderLeft: "7px solid transparent", borderRight: "7px solid transparent",
                  borderTop: "7px solid #E0E0E0",
                }} />
                <div style={{
                  position: "absolute", top: "calc(100% - 1px)", left: "50%", transform: "translateX(-50%)",
                  borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
                  borderTop: "6px solid #fff",
                }} />
              </div>
            )}
          </span>
        );
      })}
    </span>
  );
}

// ─── Main App ───
export default function App() {

  // === VIEW STATE ===
  const [view, setView] = useState("landing"); // "landing" | "prep"

  // === LANDING: CHAT ===
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // === LANDING: MAP ===
  const [activeCenter, setActiveCenter] = useState(null);
  const [showList, setShowList] = useState(false);

  // === PREP: state ===
  const [page, setPage] = useState("home");
  const [selCat, setSelCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [exempt, setExempt] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalAnim, setModalAnim] = useState(false);
  const [subModal, setSubModal] = useState(null);
  const [subModalAnim, setSubModalAnim] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [detOpt, setDetOpt] = useState(null);
  const [detQual, setDetQual] = useState(null);
  const [detTarget, setDetTarget] = useState(null);
  const [detCount, setDetCount] = useState(1);
  const [detOptions, setDetOptions] = useState({});
  const [detQty, setDetQty] = useState(1);
  const [docsContent, setDocsContent] = useState([]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading, chatOpen]);

  // ─── CHAT ───
  const findAIMatch = (query) => {
    const q = query.trim();
    const exact = AI_DATA.find(d => d.q === q);
    if (exact) return exact;
    const partial = AI_DATA.find(d => q.includes(d.q.slice(0, 4)) || d.q.includes(q.slice(0, 4)));
    return partial || null;
  };

  const sendChat = (query) => {
    if (!query.trim()) return;
    setChatOpen(true);
    setChatMessages(prev => [...prev, { role: "user", text: query }]);
    setChatInput("");
    setChatLoading(true);
    setTimeout(() => {
      const match = findAIMatch(query);
      const items = match ? match.ids.map(id => ITEMS.find(it => it.id === id)).filter(Boolean) : [];
      setChatMessages(prev => [...prev, { role: "ai", items, noMatch: !match }]);
      setChatLoading(false);
    }, 1500);
  };

  // ─── PREP HELPERS ───
  const openModal = useCallback((type) => {
    setModalAnim(true);
    setModal(type);
    setTimeout(() => setModalAnim(false), 300);
  }, []);
  const closeModal = useCallback(() => { setModal(null); setSubModal(null); }, []);
  const openSubModal = useCallback((type) => {
    setSubModalAnim(true);
    setSubModal(type);
    setTimeout(() => setSubModalAnim(false), 300);
  }, []);
  const closeSubModal = useCallback(() => setSubModal(null), []);

  const openDetail = useCallback((item, fromAI = false) => {
    setDetailItem(item);
    setDetOpt(item.opts ? item.opts.split(",")[0] : null);
    const quals = QUALS[item.id];
    setDetQual(quals && quals.length === 1 ? quals[0] : null);
    setDetTarget(null); setDetCount(1); setDetOptions({}); setDetQty(1);
    if (fromAI) openSubModal("detail");
    else openModal("detail");
  }, [openModal, openSubModal]);

  const addToCart = useCallback(() => {
    if (!detailItem) return;
    setCart(prev => [...prev, {
      key: Date.now(), item: detailItem,
      opt: detOpt, qual: detQual, target: detTarget,
      count: detCount, options: { ...detOptions }, qty: detQty,
    }]);
    if (subModal) closeSubModal(); else closeModal();
  }, [detailItem, detOpt, detQual, detTarget, detCount, detOptions, detQty, closeModal, subModal, closeSubModal]);

  const removeFromCart = useCallback((key) => setCart(prev => prev.filter(c => c.key !== key)), []);
  const updateCartQty = useCallback((key, delta) => setCart(prev => prev.map(c => c.key === key ? { ...c, qty: Math.max(1, c.qty + delta) } : c)), []);

  const totalFee = cart.reduce((s, c) => {
    if (exempt || c.qual?.ex) return s;
    return s + c.item.fee * c.qty * (c.count || 1);
  }, 0);

  const goHome = useCallback(() => { setPage("home"); setSelCat(null); closeModal(); }, [closeModal]);
  const goCat = useCallback((catId) => { setSelCat(catId); setPage("cat"); }, []);
  const goOrder = useCallback(() => { closeModal(); setPage("order"); }, [closeModal]);

  const catItems = selCat ? ITEMS.filter(i => i.cat === selCat) : [];
  const certs = catItems.filter(i => i.tp === "제증명");
  const apps = catItems.filter(i => i.tp === "신청");
  const quals = detailItem ? (QUALS[detailItem.id] || [{ qid: "default", nm: "본인", docs: [], ex: false, nt: false, tg: [], nc: false }]) : [];
  const itemOpts = detailItem ? (OPTIONS[detailItem.id] || []) : [];
  const cartCount = cart.length;

  const detailValid = (() => {
    if (!detailItem) return false;
    if (detailItem.opts && !detOpt) return false;
    if (quals.length > 1 && !detQual) return false;
    if (detQual?.nt && !detTarget) return false;
    for (const o of itemOpts) if (!detOptions[o.name]) return false;
    return true;
  })();

  const detailFee = !detailItem ? 0 : (detQual?.ex ? 0 : detailItem.fee * detQty * (detQual?.nc ? detCount : 1));

  // Sheet styles (fixed positioning for prep page)
  const sheetBase = {
    position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
    width: "100%", maxWidth: 768,
    background: C.card, borderRadius: "22px 22px 0 0",
    maxHeight: "88vh", display: "flex", flexDirection: "column",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
    zIndex: 1001,
    ...(modalAnim ? { animation: "slideUp .25s ease-out" } : {}),
  };
  const subSheetBase = {
    ...sheetBase,
    zIndex: 1003,
    ...(subModalAnim ? { animation: "slideUp .25s ease-out" } : {}),
  };

  // ─── SHARED COMPONENTS ───
  const Chip = ({ label, selected, onClick }) => (
    <button onClick={e => { e.stopPropagation(); onClick(); }} style={{
      background: selected ? C.mintLight : "#F7F7F7",
      color: selected ? C.mintDark : C.desc,
      border: `1.5px solid ${selected ? C.mint : C.border}`,
      borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: selected ? 700 : 500,
      cursor: "pointer", fontFamily: C.font, transition: "all .15s",
    }}>{label}</button>
  );

  const Stepper = ({ value, onChange, min = 1 }) => (
    <div style={{ display: "flex", alignItems: "center", borderRadius: 10, border: `1.5px solid ${C.border}`, overflow: "hidden", height: 34 }}>
      <button onClick={e => { e.stopPropagation(); onChange(Math.max(min, value - 1)); }} style={{ width: 34, height: 34, background: "#F7F7F7", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: C.text }}>−</button>
      <span style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 700, color: C.text }}>{value}</span>
      <button onClick={e => { e.stopPropagation(); onChange(value + 1); }} style={{ width: 34, height: 34, background: "#F7F7F7", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", color: C.text }}>+</button>
    </div>
  );

  // ─── LANDING: CHAT INITIAL ───
  const SUGGESTED = ["민원 신청 방법?", "행정복지센터 위치?", "등본 떼려면 뭐 필요해요?"];

  const renderChatInitial = () => (
    <section style={{ background: "linear-gradient(160deg, #E8F4FD 0%, #ffffff 100%)", padding: "28px 20px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <img src={CHAR_IMG} alt="세종이" style={{ width: 60, height: 60, borderRadius: 18, objectFit: "cover", boxShadow: "0 4px 16px rgba(0,102,204,0.2)" }} />
            <div style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, background: "#22B573", borderRadius: "50%", border: "2.5px solid #fff" }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.textPrimary }}>세종시 AI 챗봇 "세종이"에게 물어보세요!</div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>어떤 민원이든 안내해 드릴게요 😊</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <input
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") sendChat(chatInput); }}
            placeholder="어떤 민원이 필요하세요?"
            style={{ flex: 1, padding: "13px 18px", borderRadius: 14, border: `2px solid ${C.border}`, fontSize: 15, outline: "none", fontFamily: C.font, background: "#fff", transition: "border .2s" }}
            onFocus={e => { e.target.style.borderColor = C.primary; }}
            onBlur={e => { e.target.style.borderColor = C.border; }}
          />
          <button
            onClick={() => sendChat(chatInput)}
            style={{ background: chatInput.trim() ? C.primary : "#CCC", color: "#fff", border: "none", borderRadius: 14, padding: "13px 22px", fontWeight: 700, fontSize: 16, cursor: "pointer", transition: "background .2s", fontFamily: C.font }}
          >→</button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SUGGESTED.map(q => (
            <button key={q} onClick={() => sendChat(q)} style={{
              background: "#fff", color: C.primary, border: `1.5px solid ${C.primary}55`,
              borderRadius: 20, padding: "8px 16px", fontSize: 13, cursor: "pointer",
              fontFamily: C.font, fontWeight: 500, transition: "all .15s",
            }}>💬 {q}</button>
          ))}
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: C.textSecondary, background: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "7px 12px", display: "inline-block" }}>
          💡 AI 안내는 참고용이며, 정확한 사항은 창구에서 확인해 주세요.
        </div>
      </div>
    </section>
  );

  // ─── LANDING: CHAT CONVERSATION ───
  const renderChatConversation = () => (
    <section style={{ background: "linear-gradient(160deg, #E8F4FD 0%, #ffffff 100%)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Chat header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={CHAR_IMG} alt="" style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover" }} />
            <span style={{ fontWeight: 700, color: C.textPrimary }}>세종이</span>
            <span style={{ fontSize: 11, color: "#22B573", fontWeight: 700, background: "#ECFBF3", borderRadius: 6, padding: "2px 6px" }}>● 응답중</span>
          </div>
          <button onClick={() => { setChatOpen(false); setChatMessages([]); setChatInput(""); }} style={{ background: "#F0F4F8", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: C.textSecondary, fontFamily: C.font, fontWeight: 600 }}>새 대화</button>
        </div>

        {/* Messages */}
        <div style={{ padding: "16px 20px", minHeight: 200, maxHeight: 380, overflowY: "auto" }}>
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {msg.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: C.primary, color: "#fff", borderRadius: "18px 18px 4px 18px", padding: "10px 16px", fontSize: 14, maxWidth: "70%", lineHeight: 1.5 }}>
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <img src={CHAR_IMG} alt="" style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    {msg.noMatch ? (
                      <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "4px 18px 18px 18px", padding: "12px 16px", fontSize: 14, color: C.textPrimary, maxWidth: 300, lineHeight: 1.6 }}>
                        해당 민원은 창구에서 직접 안내받으시면 더 정확합니다.<br />
                        <span style={{ color: C.primary, fontWeight: 700 }}>종촌동 민원실: 044-300-0000</span>
                      </div>
                    ) : (
                      <div>
                        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "4px 18px 18px 18px", padding: "10px 14px", fontSize: 14, color: C.textPrimary, marginBottom: 8, maxWidth: 300 }}>
                          안내해 드릴게요! 아래 민원을 확인해 보세요. 😊
                        </div>
                        {msg.items.map(item => (
                          <div key={item.id} style={{ background: "#fff", border: `1.5px solid ${C.primaryLight}`, borderRadius: 12, padding: "10px 14px", marginBottom: 6, maxWidth: 300 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: C.textPrimary }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{item.desc}</div>
                            <div style={{ fontSize: 12, color: item.fee === 0 ? C.green : C.primary, fontWeight: 700, marginTop: 3 }}>{fmtFee(item.fee)}</div>
                          </div>
                        ))}
                        <button onClick={() => { setView("prep"); }} style={{
                          background: C.primary, color: "#fff", border: "none", borderRadius: 10,
                          padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                          fontFamily: C.font, marginTop: 4,
                        }}>📋 사전준비 바로가기 →</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <img src={CHAR_LOAD_IMG} alt="" style={{ width: 34, height: 34, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: "4px 18px 18px 18px", padding: "12px 16px", fontSize: 14, color: C.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                답변을 준비하고 있어요...
                <span style={{ display: "inline-flex", gap: 4, marginLeft: 4 }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ display: "inline-block", width: 6, height: 6, background: C.primary, borderRadius: "50%", animation: `bounce 1.2s ${delay}s infinite` }} />
                  ))}
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px 20px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendChat(chatInput); }}
              placeholder="추가로 궁금한 것을 물어보세요"
              style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: C.font, transition: "border .2s" }}
              onFocus={e => { e.target.style.borderColor = C.primary; }}
              onBlur={e => { e.target.style.borderColor = C.border; }}
            />
            <button onClick={() => sendChat(chatInput)} style={{ background: chatInput.trim() ? C.primary : "#CCC", color: "#fff", border: "none", borderRadius: 12, padding: "11px 18px", fontWeight: 700, cursor: "pointer", fontFamily: C.font, transition: "background .2s" }}>→</button>
          </div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 8, textAlign: "center" }}>
            💡 AI 안내는 참고용이며, 정확한 사항은 창구에서 확인해 주세요.
          </div>
        </div>
      </div>
    </section>
  );

  // ─── LANDING: WAIT STATUS MAP ───
  const renderWaitStatus = () => (
    <div style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: C.textPrimary }}>📍 실시간 대기현황</div>
        <span style={{ fontSize: 11, color: C.textSecondary, background: "#F5F7FA", borderRadius: 8, padding: "3px 8px" }}>데모 데이터</span>
      </div>

      {/* SVG Map */}
      <div style={{ position: "relative", flex: 1 }}>
        <svg width="100%" viewBox="0 0 280 220" style={{ borderRadius: 12, display: "block" }}>
          <rect width="280" height="220" fill="#EBF3FB" rx="10" />
          {/* 도로 힌트 (세종시 중심 도로망 단순화) */}
          <path d="M 60 220 Q 100 180 120 155 Q 135 135 140 100 Q 145 70 192 68 Q 220 40 254 19" stroke="#D0E6F5" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M 0 170 Q 60 165 104 144 Q 125 135 140 161 Q 155 180 180 210 Q 200 230 220 220" stroke="#D0E6F5" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M 90 220 Q 110 195 135 185 Q 155 175 163 166" stroke="#D0E6F5" strokeWidth="6" fill="none" strokeLinecap="round" />
          {/* Grid lines */}
          <line x1="0" y1="110" x2="280" y2="110" stroke="#C8DFF5" strokeWidth="0.5" strokeDasharray="4 4" />
          <line x1="140" y1="0" x2="140" y2="220" stroke="#C8DFF5" strokeWidth="0.5" strokeDasharray="4 4" />

          {CENTERS.map(c => {
            const color = waitColor(c.wait);
            const isActive = activeCenter?.id === c.id;
            return (
              <g key={c.id} onClick={() => setActiveCenter(activeCenter?.id === c.id ? null : c)} style={{ cursor: "pointer" }}>
                {c.wait !== -1 && (
                  <>
                    <circle cx={c.svgX} cy={c.svgY} r="18" fill={color} opacity="0.12" style={{ animation: "svgPulse 2s infinite" }} />
                    <circle cx={c.svgX} cy={c.svgY} r="12" fill={color} opacity="0.2" style={{ animation: "svgPulse2 2s 0.4s infinite" }} />
                  </>
                )}
                <circle cx={c.svgX} cy={c.svgY} r={isActive ? 9 : 7} fill={color} stroke="#fff" strokeWidth={isActive ? 3 : 2} />
                {c.wait > 0 && (
                  <text x={c.svgX + 10} y={c.svgY - 8} textAnchor="start" fontSize="7" fill={color} fontWeight="800" fontFamily="sans-serif">{c.wait}</text>
                )}
                <text x={c.svgX} y={c.svgY + 22} textAnchor="middle" fontSize="8" fill="#555" fontWeight="600" fontFamily="sans-serif">{c.name}</text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip popup */}
        {activeCenter && (
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            background: "#fff", border: `2px solid ${waitColor(activeCenter.wait)}55`,
            borderRadius: 14, padding: "12px 18px", minWidth: 180,
            boxShadow: "0 4px 20px rgba(0,0,0,0.14)", textAlign: "center",
            animation: "fadeIn .15s ease-out",
          }}>
            <div style={{ fontWeight: 800, color: C.textPrimary, fontSize: 15 }}>{activeCenter.name}</div>
            {activeCenter.wait === -1 ? (
              <div style={{ color: C.sub, fontSize: 13, marginTop: 4 }}>⚫ 비운영 중</div>
            ) : (
              <>
                <div style={{ color: waitColor(activeCenter.wait), fontWeight: 800, fontSize: 20, marginTop: 4 }}>
                  {activeCenter.wait === 0 ? "대기 없음" : `대기 ${activeCenter.wait}명`}
                </div>
                {activeCenter.wait > 0 && <div style={{ color: C.textSecondary, fontSize: 12, marginTop: 2 }}>예상 {activeCenter.wait * 3}분</div>}
                <div style={{ display: "inline-block", background: `${waitColor(activeCenter.wait)}20`, color: waitColor(activeCenter.wait), borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 700, marginTop: 6 }}>{waitLabel(activeCenter.wait)}</div>
              </>
            )}
            <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 6 }}>평일 09:00~18:00</div>
            <button onClick={() => setActiveCenter(null)} style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", color: C.sub, fontSize: 14, cursor: "pointer" }}>✕</button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {[["#22B573", "원활"], ["#F7941D", "보통"], ["#E84545", "혼잡"], ["#999", "비운영"]].map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textSecondary }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      {/* List toggle */}
      <button onClick={() => setShowList(p => !p)} style={{ width: "100%", marginTop: 10, padding: "8px", background: C.primaryLight, color: C.primary, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: C.font }}>
        {showList ? "지도로 보기 ▲" : "목록으로 보기 ▼"}
      </button>

      {showList && (
        <div style={{ marginTop: 8 }}>
          {CENTERS.map(c => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 2px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{c.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: waitColor(c.wait), display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: waitColor(c.wait), fontWeight: 700 }}>
                  {c.wait === -1 ? "점검중" : c.wait === 0 ? "0명" : `${c.wait}명`}
                </span>
                {c.wait > 0 && <span style={{ fontSize: 11, color: C.textSecondary }}>약 {c.wait * 3}분</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── LANDING: PREP BANNER ───
  const renderPrepBanner = () => (
    <div
      style={{
        background: `linear-gradient(145deg, ${C.primaryDark} 0%, ${C.primary} 60%, #1A8CFF 100%)`,
        borderRadius: 16, padding: "24px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: "0 4px 20px rgba(0,102,204,0.3)",
        minHeight: 320, position: "relative", overflow: "hidden",
      }}
      onClick={() => setView("prep")}
    >
      {/* 배경 장식 */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

      <img src={CHAR_IMG} alt="세종이" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 24, marginBottom: 14, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", position: "relative" }} />
      <div style={{ fontWeight: 900, fontSize: 20, color: "#fff", textAlign: "center", position: "relative" }}>민원 사전준비</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: 6, marginBottom: 20, lineHeight: 1.6, position: "relative" }}>
        미리 준비하면<br />창구에서 <strong style={{ color: "#FFE88A" }}>훨씬 빠르게!</strong>
      </div>
      <button
        style={{
          background: "#fff", color: C.primary, border: "none", borderRadius: 14,
          padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer",
          fontFamily: C.font, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          position: "relative", transition: "transform .15s",
        }}
      >사전준비 시작하기 →</button>
    </div>
  );

  // ─── LANDING PAGE ───
  const renderLanding = () => (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font }}>
      {/* Header */}
      <header style={{ background: C.primaryDark, padding: "0 20px", display: "flex", alignItems: "center", gap: 14, height: 58, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <img src={CI_IMG} alt="세종시" style={{ height: 34, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        <div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: -0.3 }}>민원 지름길</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>세종특별자치시 민원통합서비스</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.65)", background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 10px" }}>DEMO</div>
      </header>

      {/* Chatbot section */}
      {!chatOpen ? renderChatInitial() : renderChatConversation()}

      {/* Bottom 2-col grid */}
      <div style={{ padding: "16px 16px 28px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="bottom-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
          {renderWaitStatus()}
          {renderPrepBanner()}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#fff", borderTop: `1px solid ${C.border}`, padding: "16px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.9 }}>
          세종특별자치시 민원 지름길 서비스 (데모 v2.0)<br />
          AI 안내는 참고용이며, 정확한 사항은 해당 창구에서 확인해 주세요.
        </div>
      </footer>
    </div>
  );

  // ─── PREP: NAV BAR ───
  const renderPrepNavBar = () => (
    <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", background: C.card, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10, gap: 8 }}>
      {page !== "home" ? (
        <button onClick={page === "order" ? () => setPage("home") : goHome} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.text, padding: "2px 4px" }}>←</button>
      ) : (
        <button onClick={() => setView("landing")} style={{ background: C.primaryLight, color: C.primary, border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.font, whiteSpace: "nowrap" }}>← 홈으로</button>
      )}
      <span style={{ flex: 1, fontWeight: 700, fontSize: 17, color: C.text, textAlign: "center" }}>
        {page === "home" ? "민원 사전준비" : page === "order" ? "요청서" : selCat || ""}
      </span>
      {page !== "order" ? (
        <button onClick={() => openModal("cart")} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", position: "relative", padding: 4, color: C.text }}>
          🛒
          {cartCount > 0 && <span style={{ position: "absolute", top: -2, right: -4, background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{cartCount}</span>}
        </button>
      ) : <div style={{ width: 42 }} />}
    </div>
  );

  // ─── PREP: HOME (카테고리, AI 섹션 없음) ───
  const renderPrepHome = () => (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      <div style={{ marginBottom: 16, padding: "10px 14px", background: C.primaryLight, borderRadius: 12, fontSize: 13, color: C.primary, fontWeight: 600 }}>
        📋 민원 종류를 선택하면 필요 서류를 안내해 드려요
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CATS.map(cat => (
          <button key={cat.id} onClick={() => goCat(cat.id)} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
            padding: "18px 14px", textAlign: "center", cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)", fontFamily: C.font, transition: "transform .15s, box-shadow .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,102,204,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 2 }}>{cat.id}</div>
            <div style={{ fontSize: 11, color: C.sub }}>{cat.sub}</div>
          </button>
        ))}
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  // ─── PREP: CAT ───
  const renderCat = () => (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      {certs.length > 0 && (
        <>
          <div style={{ display: "inline-block", background: C.mintLight, color: C.mintDark, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 10, marginBottom: 10 }}>제증명 발급</div>
          {certs.map(it => (
            <button key={it.id} onClick={() => openDetail(it)} style={{ display: "block", width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8, textAlign: "left", cursor: "pointer", fontFamily: C.font, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}><GlossaryText text={it.name} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: it.fee === 0 ? C.green : C.text, flexShrink: 0, marginLeft: 8 }}>{fmtFee(it.fee)}</div>
              </div>
              <div style={{ fontSize: 12, color: C.desc, marginTop: 3 }}><GlossaryText text={it.desc} /></div>
            </button>
          ))}
        </>
      )}
      {apps.length > 0 && (
        <>
          <div style={{ display: "inline-block", background: C.amberBg, color: C.amber, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 10, marginTop: certs.length ? 14 : 0, marginBottom: 10 }}>신청 민원</div>
          {apps.map(it => (
            <button key={it.id} onClick={() => openDetail(it)} style={{ display: "block", width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 8, textAlign: "left", cursor: "pointer", fontFamily: C.font, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text }}><GlossaryText text={it.name} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.green, flexShrink: 0, marginLeft: 8 }}>무료</div>
              </div>
              <div style={{ fontSize: 12, color: C.desc, marginTop: 3 }}><GlossaryText text={it.desc} /></div>
            </button>
          ))}
        </>
      )}
      <div style={{ height: 20 }} />
    </div>
  );

  // ─── PREP: ORDER ───
  const renderOrder = () => (
    <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
      <div style={{ background: `linear-gradient(135deg, ${C.mint}, ${C.mintDark})`, borderRadius: 18, padding: "24px 20px", marginBottom: 16, color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: .85, marginBottom: 4 }}>요청서 완성</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>총 {cart.length}건 · {exempt ? "면제" : fmtFee(totalFee)}</div>
      </div>
      {sortByCategory(cart).map(group => (
        <div key={group.cat}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "12px 0 8px" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.sub, whiteSpace: "nowrap" }}>{CATS.find(ct => ct.id === group.cat)?.icon} {group.cat}</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>
          {group.items.map(c => (
            <div key={c.key} style={{ background: C.card, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 6 }}><GlossaryText text={c.item.name} /></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 12 }}>
                {c.opt && <span style={{ background: C.mintLight, color: C.mintDark, padding: "2px 8px", borderRadius: 8 }}>{c.opt}</span>}
                {c.qual && <span style={{ background: "#F0F0F0", color: C.desc, padding: "2px 8px", borderRadius: 8 }}>{c.qual.nm}</span>}
                {c.target && <span style={{ background: "#F0F0F0", color: C.desc, padding: "2px 8px", borderRadius: 8 }}>{c.target}{c.count > 1 ? ` ${c.count}명` : ""}</span>}
                <span style={{ background: "#F0F0F0", color: C.desc, padding: "2px 8px", borderRadius: 8 }}>{c.qty}부</span>
              </div>
              {Object.entries(c.options).map(([k, v]) => (<div key={k} style={{ fontSize: 11, color: C.sub, marginTop: 4 }}>{k}: {v}</div>))}
              {c.qual?.docs?.length > 0 && (
                <button onClick={e => { e.stopPropagation(); setDocsContent(c.qual.docs.map(d => c.qual.nc ? `${d} ${c.count}장` : d)); openModal("docs"); }} style={{ marginTop: 8, background: C.amberBg, color: C.amber, border: `1px solid ${C.amber}33`, borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.font }}>📋 필요서류 확인</button>
              )}
              <div style={{ textAlign: "right", fontSize: 14, fontWeight: 700, color: c.qual?.ex || exempt ? C.green : C.text, marginTop: 8 }}>
                {c.qual?.ex || exempt ? "면제" : fmtFee(c.item.fee * c.qty * (c.qual?.nc ? c.count : 1))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ padding: "16px 0", display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={goHome} style={{ flex: 1, padding: "14px", borderRadius: 14, border: `2px solid ${C.mint}`, background: "#fff", color: C.mint, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: C.font }}>수정하기</button>
        <button onClick={() => openModal("receipt")} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: C.mint, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: C.font }}>QR 출력</button>
      </div>
      <div style={{ height: 20 }} />
    </div>
  );

  // ─── PREP: DETAIL SHEET ───
  const renderDetailSheet = (asSubModal = false) => {
    if (!detailItem) return null;
    const style = asSubModal ? subSheetBase : sheetBase;
    return (
      <div style={style} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#DDD" }} />
        </div>
        <div style={{ padding: "0 20px 8px" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}><GlossaryText text={detailItem.name} /></div>
          <div style={{ fontSize: 13, color: C.desc, marginTop: 2 }}><GlossaryText text={detailItem.desc} /></div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
          {detailItem.opts && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>증명서 유형 <span style={{ color: C.red, fontSize: 11 }}>필수</span></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {detailItem.opts.split(",").map(o => <Chip key={o} label={o} selected={detOpt === o} onClick={() => setDetOpt(o)} />)}
              </div>
            </div>
          )}
          {quals.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>신청자격 <span style={{ color: C.red, fontSize: 11 }}>필수</span></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {quals.map(q => <Chip key={q.qid} label={q.nm} selected={detQual?.qid === q.qid} onClick={() => { setDetQual(q); setDetTarget(null); setDetCount(1); }} />)}
              </div>
            </div>
          )}
          {detQual?.nt && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>발급대상자 <span style={{ color: C.red, fontSize: 11 }}>필수</span></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {detQual.tg.map(t => <Chip key={t} label={t} selected={detTarget === t} onClick={() => setDetTarget(t)} />)}
              </div>
            </div>
          )}
          {detQual?.nc && detTarget && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>대상자 수</div>
                <Stepper value={detCount} onChange={setDetCount} />
              </div>
            </div>
          )}
          {itemOpts.map(o => (
            <div key={o.name} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 8 }}>{o.name} <span style={{ color: C.red, fontSize: 11 }}>필수</span></div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {o.choices.map(ch => <Chip key={ch} label={ch} selected={detOptions[o.name] === ch} onClick={() => setDetOptions(prev => ({ ...prev, [o.name]: ch }))} />)}
              </div>
            </div>
          ))}
          {detailItem.tp === "제증명" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>부수 (발급 수량)</div>
                <Stepper value={detQty} onChange={setDetQty} />
              </div>
            </div>
          )}
          <div style={{ background: "#F9F9F9", borderRadius: 12, padding: 14, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>요청 요약</div>
            {detQual?.ex && <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>✓ 수수료 면제 대상</div>}
            {detQual?.docs?.length > 0 && (
              <div style={{ fontSize: 12, color: C.amber, fontWeight: 600, marginTop: 2 }}>
                📋 필요서류: {detQual.docs.map(d => detQual.nc && detCount > 1 ? `${d} ${detCount}장` : d).join(", ")}
              </div>
            )}
            {detQual?.note && <div style={{ fontSize: 11, color: C.desc, marginTop: 2 }}>※ {detQual.note}</div>}
            {Object.entries(detOptions).map(([k, v]) => (<div key={k} style={{ fontSize: 12, color: C.desc, marginTop: 2 }}>{k}: {v}</div>))}
          </div>
        </div>
        <div style={{ padding: "12px 20px 24px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={addToCart} disabled={!detailValid} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: detailValid ? C.mint : "#DDD", color: "#fff",
            fontWeight: 700, fontSize: 15, cursor: detailValid ? "pointer" : "default", fontFamily: C.font,
          }}>
            {detailValid ? `${fmtFee(detailFee)} · 담기` : "옵션을 선택해주세요"}
          </button>
        </div>
      </div>
    );
  };

  // ─── PREP: CART SHEET ───
  const renderCartSheet = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#DDD" }} />
      </div>
      <div style={{ padding: "0 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>담기 목록 ({cartCount})</div>
        <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.sub }}>✕</button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: C.sub, fontSize: 15 }}>담긴 민원이 없습니다</div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "10px 12px", background: C.greenBg, borderRadius: 12 }}>
              <input type="checkbox" checked={exempt} onChange={e => setExempt(e.target.checked)} id="exempt" style={{ width: 18, height: 18, cursor: "pointer" }} />
              <label htmlFor="exempt" style={{ fontSize: 14, fontWeight: 600, color: C.text, cursor: "pointer" }}>수수료 면제 (장애인·국가유공자 등)</label>
            </div>
            {cart.map(c => (
              <div key={c.key} style={{ background: "#F9F9F9", borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text, flex: 1 }}><GlossaryText text={c.item.name} /></div>
                  <button onClick={() => removeFromCart(c.key)} style={{ background: "none", border: "none", color: C.sub, fontSize: 18, cursor: "pointer", padding: "0 0 0 8px", flexShrink: 0 }}>✕</button>
                </div>
                <div style={{ fontSize: 12, color: C.desc, marginTop: 3 }}>{[c.qual?.nm, c.opt, c.target].filter(Boolean).join(" · ")}</div>
                {c.item.tp === "제증명" && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", borderRadius: 8, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                      <button onClick={() => updateCartQty(c.key, -1)} style={{ width: 30, height: 30, background: "#F0F0F0", border: "none", fontSize: 14, cursor: "pointer", color: C.text }}>−</button>
                      <span style={{ width: 32, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{c.qty}부</span>
                      <button onClick={() => updateCartQty(c.key, 1)} style={{ width: 30, height: 30, background: "#F0F0F0", border: "none", fontSize: 14, cursor: "pointer", color: C.text }}>+</button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.qual?.ex || exempt ? C.green : C.text }}>
                      {c.qual?.ex || exempt ? "면제" : fmtFee(c.item.fee * c.qty * (c.qual?.nc ? c.count : 1))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <div style={{ padding: "12px 20px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>합계</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: exempt ? C.green : C.text }}>{exempt ? "면제" : fmtFee(totalFee)}</span>
        </div>
        <button onClick={goOrder} disabled={cartCount === 0} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: cartCount > 0 ? C.mint : "#DDD", color: "#fff",
          fontWeight: 700, fontSize: 15, cursor: cartCount > 0 ? "pointer" : "default", fontFamily: C.font,
        }}>요청서 보기 ({cartCount}건)</button>
      </div>
    </div>
  );

  // ─── PREP: DOCS MODAL ───
  const renderDocsModal = () => (
    <div style={sheetBase} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "#DDD" }} />
      </div>
      <div style={{ padding: "16px 20px 24px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 12 }}>📋 필요서류 안내</div>
        {docsContent.map((d, i) => (
          <div key={i} style={{ background: C.amberBg, borderRadius: 10, padding: "10px 14px", marginBottom: 6, fontSize: 14, color: C.amber, fontWeight: 600 }}>
            {i + 1}. <GlossaryText text={d} />
          </div>
        ))}
        <button onClick={closeModal} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "none", background: C.mint, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: C.font, marginTop: 10 }}>확인</button>
      </div>
    </div>
  );

  // ─── PREP: RECEIPT ───
  const renderReceipt = () => {
    const grouped = sortByCategory(cart);
    return (
      <div style={{ ...sheetBase, maxHeight: "92vh" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "#DDD" }} />
        </div>
        <div style={{ padding: "0 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.text }}>감열지 미리보기</div>
          <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.sub }}>✕</button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "0 16px 20px" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <img src={QR_IMG} alt="QR" style={{ width: 140, height: 140, imageRendering: "pixelated" }} />
            <div style={{ fontSize: 12, fontWeight: 700, color: C.mintDark, marginTop: 6 }}>출력 QR</div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>QR코드를 스캔하면 감열지가 출력됩니다</div>
          </div>
          <div style={{ width: 280, margin: "0 auto", background: "#fff", border: "1px solid #ddd", borderRadius: 4, padding: "16px 12px", fontFamily: "'Courier New', monospace", fontSize: 11, lineHeight: 1.6, color: "#222", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>세종 민원 지름길</div>
            <div style={{ textAlign: "center", fontSize: 10, marginBottom: 8, color: "#666" }}>요 청 서</div>
            <div style={{ borderTop: "2px dashed #999", marginBottom: 8 }} />
            {grouped.map(group => (
              <div key={group.cat}>
                <div style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#555", margin: "6px 0 4px" }}>── {group.cat} ──</div>
                {group.items.map(c => (
                  <div key={c.key} style={{ marginBottom: 6, paddingBottom: 4, borderBottom: "1px dotted #ccc" }}>
                    <div style={{ fontWeight: 700, fontSize: 11 }}>{c.item.name}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>
                      {[c.item.tp === "제증명" ? "제증명" : "신청", c.qual?.nm, c.target && `대상:${c.target}${c.count > 1 ? `(${c.count}명)` : ""}`, c.item.tp === "제증명" && `${c.qty}부`].filter(Boolean).join(" / ")}
                    </div>
                    {c.opt && <div style={{ fontSize: 10, color: "#555" }}>유형: {c.opt}</div>}
                    {Object.entries(c.options).map(([k, v]) => (<div key={k} style={{ fontSize: 10, color: "#555" }}>{k}: {v}</div>))}
                    {c.qual?.docs?.length > 0 && <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>필요서류: {c.qual.docs.map(d => c.qual.nc && c.count > 1 ? `${d} ${c.count}장` : d).join(", ")}</div>}
                    <div style={{ textAlign: "right", fontSize: 10, fontWeight: 700 }}>{c.qual?.ex || exempt ? "면제" : fmtFee(c.item.fee * c.qty * (c.qual?.nc ? c.count : 1))}</div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ borderTop: "2px dashed #999", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 12 }}>
              <span>총 수수료</span>
              <span style={{ color: exempt ? "#22B573" : "#222" }}>{exempt ? "면제" : fmtFee(totalFee)}</span>
            </div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>총 {cart.length}건</div>
            <div style={{ borderTop: "2px dashed #999", margin: "8px 0" }} />
          </div>
        </div>
      </div>
    );
  };

  // ─── PREP PAGE ───
  const renderPrep = () => (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.font, display: "flex", flexDirection: "column", maxWidth: 768, margin: "0 auto" }}>
      {renderPrepNavBar()}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {page === "home" && renderPrepHome()}
        {page === "cat" && renderCat()}
        {page === "order" && renderOrder()}
      </div>

      {/* Modal backdrop */}
      {modal && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000 }}>
          {modal === "detail" && renderDetailSheet()}
          {modal === "cart" && renderCartSheet()}
          {modal === "docs" && renderDocsModal()}
          {modal === "receipt" && renderReceipt()}
          {subModal === "detail" && (
            <div onClick={e => { e.stopPropagation(); closeSubModal(); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)", zIndex: 1002 }}>
              {renderDetailSheet(true)}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─── ROOT ───
  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes svgPulse { 0%, 100% { opacity: 0.12; r: 18; } 50% { opacity: 0.28; r: 22; } }
        @keyframes svgPulse2 { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.45; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; box-sizing: border-box; }
        @media (max-width: 580px) {
          .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {view === "landing" ? renderLanding() : renderPrep()}
    </div>
  );
}
