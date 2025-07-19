<?php

namespace Database\Seeders;

use App\Models\AIChat;
use App\Models\AIMessage;
use App\Models\User;
use Illuminate\Database\Seeder;

class AIChatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->info('No users found. Creating sample users first...');
            $users = User::factory(3)->create();
        }

        $conversations = [
            [
                'title' => 'Apple Tree Disease Diagnosis',
                'messages' => [
                    ['role' => 'user', 'content' => 'I noticed some brown spots on my apple tree leaves. What could this be?'],
                    ['role' => 'assistant', 'content' => 'Brown spots on apple tree leaves could indicate several diseases. The most common are apple scab, cedar apple rust, or fire blight. Could you describe the spots in more detail? Are they circular, irregular, or have any specific pattern?'],
                    ['role' => 'user', 'content' => 'The spots are circular and have a dark brown color with a lighter center. They appeared after some rainy weather.'],
                    ['role' => 'assistant', 'content' => 'Based on your description, this sounds like apple scab (Venturia inaequalis). This fungal disease is very common and thrives in wet conditions. Here are some treatment options:\n\n1. Remove and destroy fallen leaves\n2. Apply fungicide early in the season\n3. Improve air circulation through pruning\n4. Consider resistant apple varieties for future planting\n\nWould you like me to provide more specific treatment details?'],
                    ['role' => 'user', 'content' => 'Yes, please. What fungicide should I use and when should I apply it?'],
                    ['role' => 'assistant', 'content' => 'For apple scab, you can use copper-based fungicides or products containing captan or myclobutanil. Apply at these key times:\n\n- Green tip stage (when buds start to swell)\n- Pink bud stage\n- Petal fall\n- Every 7-10 days during wet weather\n\nAlways follow label instructions and wear protective gear. Organic options include neem oil or sulfur-based products.'],
                ],
            ],
            [
                'title' => 'Tomato Plant Care Questions',
                'messages' => [
                    ['role' => 'user', 'content' => 'When is the best time to plant tomatoes to avoid diseases?'],
                    ['role' => 'assistant', 'content' => 'The best time to plant tomatoes depends on your climate zone, but generally:\n\n- Start seeds indoors 6-8 weeks before last frost\n- Transplant outside 2-3 weeks after last frost\n- Soil temperature should be at least 60°F (15°C)\n\nTo avoid diseases:\n- Choose disease-resistant varieties\n- Plant in well-draining soil\n- Space plants properly for air circulation\n- Avoid overhead watering\n- Rotate crops yearly'],
                    ['role' => 'user', 'content' => 'What are the most common tomato diseases I should watch for?'],
                    ['role' => 'assistant', 'content' => 'The most common tomato diseases include:\n\n1. **Early Blight**: Brown spots with concentric rings on lower leaves\n2. **Late Blight**: Water-soaked lesions that spread rapidly\n3. **Septoria Leaf Spot**: Small brown spots with gray centers\n4. **Bacterial Spot**: Small dark lesions with yellow halos\n5. **Powdery Mildew**: White powdery coating on leaves\n\nPrevention is key - use resistant varieties, proper spacing, and avoid wetting leaves when watering.'],
                ],
            ],
            [
                'title' => 'Grape Vine Disease Prevention',
                'messages' => [
                    ['role' => 'user', 'content' => 'How can I prevent diseases in my grape vines?'],
                    ['role' => 'assistant', 'content' => 'Grape vine disease prevention involves several key practices:\n\n1. **Site Selection**: Choose well-draining soil with good air circulation\n2. **Pruning**: Remove dead/diseased wood and maintain open canopy\n3. **Trellising**: Proper trellising improves air flow and reduces disease pressure\n4. **Sanitation**: Remove fallen leaves and fruit\n5. **Fungicide Program**: Apply preventative fungicides during growing season\n6. **Resistant Varieties**: Choose disease-resistant grape varieties when possible'],
                    ['role' => 'user', 'content' => 'What fungicides are safe to use on grapes?'],
                    ['role' => 'assistant', 'content' => 'Safe fungicides for grapes include:\n\n**Organic Options**:\n- Copper-based products\n- Sulfur\n- Neem oil\n- Potassium bicarbonate\n\n**Conventional Options**:\n- Captan\n- Mancozeb\n- Myclobutanil\n- Tebuconazole\n\nAlways read labels carefully, follow application rates, and observe pre-harvest intervals. Consider organic options for home gardens.'],
                ],
            ],
            [
                'title' => 'Corn Disease Identification',
                'messages' => [
                    ['role' => 'user', 'content' => 'I see some grayish spots on my corn leaves. What disease is this?'],
                    ['role' => 'assistant', 'content' => 'Grayish spots on corn leaves could be several diseases. The most common are:\n\n1. **Gray Leaf Spot**: Rectangular, gray to tan lesions\n2. **Northern Corn Leaf Blight**: Long, elliptical, grayish-green lesions\n3. **Common Rust**: Small, circular, brick-red to brown pustules\n\nCould you describe the spots more specifically? Are they rectangular, circular, or elongated? And what color are they exactly?'],
                    ['role' => 'user', 'content' => 'They are rectangular and grayish-tan in color.'],
                    ['role' => 'assistant', 'content' => 'That sounds like Gray Leaf Spot, caused by the fungus Cercospora zeae-maydis. This disease is common in warm, humid conditions.\n\n**Management Options**:\n- Plant resistant hybrids\n- Rotate crops (don\'t plant corn in same field for 2-3 years)\n- Apply fungicides if disease pressure is high\n- Remove crop debris after harvest\n\nThe disease usually doesn\'t require treatment unless it appears early in the season or conditions are very favorable for disease development.'],
                ],
            ],
            [
                'title' => 'Organic Disease Control Methods',
                'messages' => [
                    ['role' => 'user', 'content' => 'What are the best organic methods to control plant diseases?'],
                    ['role' => 'assistant', 'content' => 'Effective organic disease control methods include:\n\n**Cultural Practices**:\n- Crop rotation\n- Proper spacing and pruning\n- Sanitation (remove infected plant parts)\n- Healthy soil management\n\n**Natural Products**:\n- Copper-based fungicides\n- Sulfur\n- Neem oil\n- Baking soda solutions\n- Compost tea\n- Garlic and chili pepper sprays\n\n**Prevention**:\n- Choose resistant varieties\n- Plant at optimal times\n- Avoid overhead watering\n- Use clean tools and equipment\n\nRemember, prevention is always better than cure in organic gardening!'],
                    ['role' => 'user', 'content' => 'How do I make a baking soda spray?'],
                    ['role' => 'assistant', 'content' => 'Here\'s how to make an effective baking soda spray:\n\n**Recipe**:\n- 1 tablespoon baking soda\n- 1 tablespoon vegetable oil\n- 1 teaspoon liquid soap (not detergent)\n- 1 gallon water\n\n**Instructions**:\n1. Mix baking soda and oil in a small container\n2. Add liquid soap and mix well\n3. Pour into 1 gallon of water and stir thoroughly\n4. Apply to plants every 7-14 days\n\n**Best for**: Powdery mildew, black spot, and some fungal diseases\n\n**Tips**:\n- Test on a small area first\n- Apply in cool weather\n- Don\'t use on hot, sunny days\n- Reapply after rain'],
                ],
            ],
        ];

        foreach ($conversations as $conversation) {
            $chat = AIChat::create([
                'user_id' => $users->random()->id,
                'title' => $conversation['title'],
                'status' => 'active',
                'metadata' => [
                    'topic' => 'plant_disease',
                    'created_at' => now()->subDays(rand(1, 14)),
                ],
            ]);

            foreach ($conversation['messages'] as $messageData) {
                AIMessage::create([
                    'ai_chat_id' => $chat->id,
                    'role' => $messageData['role'],
                    'content' => $messageData['content'],
                    'tokens_used' => rand(50, 200),
                    'metadata' => [
                        'model' => 'gpt-3.5-turbo',
                        'temperature' => 0.7,
                    ],
                ]);
            }

            // Set the chat creation time based on the first message
            $chat->created_at = now()->subDays(rand(1, 14));
            $chat->save();
        }

        $this->command->info('AI chat conversations seeded successfully!');
    }
}