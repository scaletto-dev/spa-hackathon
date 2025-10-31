/**
 * Support Chat Routes
 * All routes are prefixed with /api/v1/support
 */

import { Router } from 'express';
import supportController from '../controllers/support.controller';

const router = Router();

// Conversations
router.get('/conversations', supportController.getConversations);
router.get('/conversations/:id', supportController.getConversation);
router.post('/conversations', supportController.createConversation);
router.patch('/conversations/:id', supportController.updateConversation);
router.post('/conversations/:id/assign', supportController.assignConversation);
router.post('/conversations/:id/close', supportController.closeConversation);
router.delete('/conversations/:id', supportController.deleteConversation);
router.post('/conversations/bulk-delete', supportController.bulkDeleteConversations);

// Messages
router.get('/conversations/:id/messages', supportController.getMessages);
router.post('/messages', supportController.sendMessage);

// AI Suggestions
router.get('/conversations/:id/ai-suggestions', supportController.getAISuggestions);

// Statistics
router.get('/statistics', supportController.getStatistics);

export default router;
