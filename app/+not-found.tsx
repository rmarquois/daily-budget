import { router } from 'expo-router'
import { View } from 'react-native'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'

export default function NotFoundScreen() {
  return (
    <View className="bg-background h-vh-safe">
      <View className="flex-1 items-center justify-center px-6">
        <Card className="w-full max-w-sm">
          <CardHeader className="items-center">
            <CardTitle className="text-h2 text-card-foreground">404 – Not found</CardTitle>
            <CardDescription className="text-body text-muted-foreground">
              The page you're looking couldn't be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="items-center">
            <Text className="text-caption text-muted-foreground text-center">
              Your page may have moved or may not exist yet for this version of the app.
            </Text>
          </CardContent>
          <CardFooter className="gap-3">
            <Button onPress={() => router.replace('/')} className="flex-1">
              <Text className="text-button text-primary-foreground">Go to Home</Text>
            </Button>
            <Button variant="outline" onPress={() => router.back()} className="flex-1">
              <Text className="text-button text-foreground">Go Back</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </View>
  )
}
