import { Router, Request, Response } from 'express';
import { GetUserRequest, GetUserResponse, STResponse } from '@package-backend/types';

const router = Router();
// /**
//  * @swagger
//  * /:
//  *   get:
//  *     description: Get users
//  *     parameters:
//  *       - name: username
//  *         in: query
//  *         required: false
//  *         description: The username to filter by
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: An array of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: string
//  *       400:
//  *         description: Bad Request.
//  */
// router.get('/', (req: Request, res: Response) => {
//   const { username } = req.query;
//   // 로직 구현
//   console.log(username);
//   res.send(['John', 'Doe']);
// });

/**
 * @swagger
 * /{id}:
 *   get:
 *     description: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to get
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 age:
 *                   type: integer
 *       404:
 *         description: User not found.
 */
router.get('/:id', async (req: Request<GetUserRequest>, res: Response<STResponse<GetUserResponse>>) => {
  const { id } = req.params;
  // 로직 구현
  if (id === '1234') {
    await new Promise((res) => setTimeout(res, 5000));
    res.json({ data: { name: 'John' } });
  } else {
    res.status(500).json({ message: '우하호호호호' });
  }
  // throw new Error('dddddd');
});
export default router;
