//
//  FacebookAPIManager.m
//  oevo
//
//  Created by jagelooyadav on 03/11/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "FacebookAPIManager.h"

#import <React/RCTUtils.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RCTConvert+FBSDKLogin.h"


@implementation FacebookAPIManager{
  FBSDKLoginManager *_loginManager;
}


RCT_EXPORT_METHOD(findProfile: (RCTResponseSenderBlock)callback)
{
  callback(@[RCTBuildProfileDictionary(nil)]);
}

RCT_EXPORT_METHOD(isLoggedInFacebook: (RCTResponseSenderBlock)callback)
{
  
  callback(@[@([FBSDKAccessToken currentAccessToken] != nil)]);
}

@synthesize bridge = _bridge;

- (NSArray<NSString *> *)supportedEvents{
  return @[@"LoginSuccessFull"];
}
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (instancetype)init
{
  if ((self = [super init])) {
    _loginManager = [[FBSDKLoginManager alloc] init];
  }
  return self;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(test)
{
  
  
}


#pragma mark - React Native Methods


RCT_EXPORT_METHOD(setLoginBehavior:(FBSDKLoginBehavior)behavior)
{
  _loginManager.loginBehavior = behavior;
}

RCT_EXPORT_METHOD(setDefaultAudience:(FBSDKDefaultAudience)audience)
{
  _loginManager.defaultAudience = audience;
}

RCT_REMAP_METHOD(getLoginBehavior, getLoginBehavior_resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(LoginBehaviorToString([_loginManager loginBehavior]));
}

RCT_REMAP_METHOD(getDefaultAudience, getDefaultAudience_resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(DefaultAudienceToString([_loginManager defaultAudience]));
}

RCT_EXPORT_METHOD(logInWithReadPermissions:(NSStringArray *)permissions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _loginWithPermissions:permissions resolver:resolve rejecter:reject isRead:YES];
};

RCT_EXPORT_METHOD(logInWithPublishPermissions:(NSStringArray *)permissions
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self _loginWithPermissions:permissions resolver:resolve rejecter:reject isRead:NO];
};

RCT_EXPORT_METHOD(logOut)
{
  [_loginManager logOut];
};

#pragma mark - Helper Methods

- (void)_loginWithPermissions:(NSStringArray *)permissions
                     resolver:(RCTPromiseResolveBlock)resolve
                     rejecter:(RCTPromiseRejectBlock)reject
                       isRead:(BOOL)isRead
{
  FBSDKLoginManagerRequestTokenHandler requestHandler = ^(FBSDKLoginManagerLoginResult *result, NSError *error) {
    if (error) {
      reject(@"FacebookSDK", @"Login Failed", error);
    } else {
      //resolve(RCTBuildResultDictionary(result));
      //fields=name,email,gender,picture&access_token=' + data.credentials.token
      FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]
                                    initWithGraphPath:[NSString stringWithFormat:@"/me"]
                                    parameters:@{@"fields": @"id, name, email, picture.width(100).height(100)"}
                                    HTTPMethod:@"GET"];
      [request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,
                                            id result,
                                            NSError *error) {
        if (error) {
          reject(@"FacebookSDK", @"fetching friends list Failed", error);
        }
        else {
          resolve(RCTBuildProfileDictionary(result));
        }
        
        // Handle the result
      }];
    }
  };
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  if (isRead) {
    [_loginManager logInWithReadPermissions:permissions handler:requestHandler];
  } else {
    [_loginManager logInWithPublishPermissions:permissions handler:requestHandler];
  }
#pragma clang diagnostic pop
}

static NSDictionary *RCTBuildResultDictionary(FBSDKLoginManagerLoginResult *result)
{
  return @{
           @"isCancelled": @(result.isCancelled),
           @"grantedPermissions": result.isCancelled ? [NSNull null] : result.grantedPermissions.allObjects,
           @"declinedPermissions": result.isCancelled ? [NSNull null] : result.declinedPermissions.allObjects,
           };
}

static NSDictionary *RCTBuildProfileDictionary(NSDictionary* profileData)
{
  static NSDictionary *staticProfile = nil;
  if (!profileData && staticProfile) {
    return staticProfile;
  }
  staticProfile = @{
                    @"profileURL": [profileData objectForKey:@"picture"][@"url"] ? : [NSNull null],
                    @"name": profileData[@"name"] ? :[NSNull null],
                    @"email": profileData[@"email"] ? : [NSNull null]
                    };
  return profileData;
}

static NSString *LoginBehaviorToString(FBSDKLoginBehavior loginBehavior)
{
  NSString *result = nil;
  switch (loginBehavior) {
    case FBSDKLoginBehaviorBrowser:
      result = @"browser";
      break;
    case FBSDKLoginBehaviorNative:
      result = @"native";
      break;
    case FBSDKLoginBehaviorSystemAccount:
      result = @"system-account";
      break;
    case FBSDKLoginBehaviorWeb:
      result = @"web";
      break;
    default:
      break;
  }
  return result;
}


static NSString *DefaultAudienceToString(FBSDKDefaultAudience defaultAudience)
{
  NSString *result = nil;
  switch (defaultAudience) {
    case FBSDKDefaultAudienceFriends:
      result = @"friends";
      break;
    case FBSDKDefaultAudienceEveryone:
      result = @"everyone";
      break;
    case FBSDKDefaultAudienceOnlyMe:
      result = @"only-me";
      break;
    default:
      break;
  }
  return result;
}


@end
