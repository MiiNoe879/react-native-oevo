//
//  TwitterAPIManager.m
//  oevo
//
//  Created by jagelooyadav on 05/11/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "TwitterAPIManager.h"
#import <TwitterKit/TwitterKit.h>

@interface TwitterAPIManager()


@end

@implementation TwitterAPIManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents{
  return @[@"LoginSuccessFull"];
}

- (void)showAlert:(NSString*)message title: (NSString*)title {
  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message: message delegate:nil cancelButtonTitle:@"Okay" otherButtonTitles:nil, nil];
  [alert show];
}


RCT_EXPORT_METHOD(logInTwitter: (RCTResponseSenderBlock)callback)
{
  static NSString *userId = nil;
  if ([[Twitter sharedInstance].sessionStore hasLoggedInUsers]) {
    NSLog(@"already logged In");
    [[Twitter sharedInstance].sessionStore logOutUserID: userId];
  }
  
  [[Twitter sharedInstance] logInWithCompletion:^(TWTRSession *session, NSError *error) {
    if (session) {
      userId = session.userID;
    
      TWTRAPIClient *client = [TWTRAPIClient clientWithCurrentUser];
      NSURLRequest *request = [client URLRequestWithMethod:@"GET" URL:@"https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
                                                parameters:@{@"Name": session.userName ? : @"", @"include_email": @"true", @"skip_status": @"true"}
                                                     error:nil];
      [client sendTwitterRequest:request completion:^(NSURLResponse * _Nullable response, NSData * _Nullable data, NSError * _Nullable connectionError) {
        NSError *error = nil;
        if (data) {
          NSJSONSerialization *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:&error];
          NSLog(@"twitter profile = %@", json);
          callback(@[json]);
          //[self showAlert:@" You are conneced to twitter now" title:[session userName]];
        } else {
         [self showAlert:[error localizedDescription] title:@"Error"];
        }
      }];
      
    } else {
     [self showAlert:[error localizedDescription] title:@"Error"];
    }
  }];
}

@end
